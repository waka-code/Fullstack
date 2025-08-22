import React, { useCallback, useEffect, useState } from 'react'
import { TaskFormProps } from '../components/TaskForm';
import { TaskFormData } from '../types';
import { useLocation } from 'react-router-dom';

export function useTaskForm({
  onSubmit,
  initialValues = { name: undefined, completed: false },
}: TaskFormProps) {
  const location = useLocation();
  const taskFromState = location.state?.task;

  const [formData, setFormData] = useState<TaskFormData>(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

  useEffect(() => {
    if (taskFromState) {
      setFormData({ name: taskFromState.name, completed: taskFromState.completed });
    }
  }, [taskFromState]);

  const validateForm = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Task name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    } else if (formData.name.trim().length > 255) {
      newErrors.name = 'Name cannot exceed 255 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        name: formData.name?.trim(),
        completed: formData.completed
      });

      if (!initialValues.name) {
        setFormData({ name: "", completed: false });
      }

      setErrors({});
      setFormData({ name: "", completed: false });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }, [formData, initialValues.name, onSubmit, validateForm]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  return {
    formData,
    errors,
    handleInputChange,
    handleSubmit
  };
}