import React, { useCallback, useState } from 'react'
import { TaskFormProps } from '../components/TaskForm';
import { TaskFormData } from '../types';

export function useTaskForm({
  onSubmit,
  initialValues = { name: '', completed: false },
}: TaskFormProps) {
 const [formData, setFormData] = useState<TaskFormData>(initialValues);
 const [errors, setErrors] = useState<{ [key: string]: string }>({});

 const validateForm = useCallback((): boolean => {
  const newErrors: { [key: string]: string } = {};

  if (!formData.name.trim()) {
   newErrors.name = 'El nombre de la tarea es requerido';
  } else if (formData.name.trim().length < 3) {
   newErrors.name = 'El nombre debe tener al menos 3 caracteres';
  } else if (formData.name.trim().length > 255) {
   newErrors.name = 'El nombre no puede exceder 255 caracteres';
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
    name: formData.name.trim(),
    completed: formData.completed
   });

   if (!initialValues.name) {
    setFormData({ name: '', completed: false });
   }

   setErrors({});
  } catch (error) {
   console.error('Error al enviar formulario:', error);
  }
 }, [formData, initialValues, onSubmit]);

 const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({
   ...prev,
   [name]: type === 'checkbox' ? checked : value
  }));

  // Limpiar error del campo cuando el usuario empiece a escribir
  if (errors[name]) {
   setErrors(prev => ({ ...prev, [name]: '' }));
  }
 }, [errors]);
 return {
    formData,
    errors,
    handleInputChange,
    handleSubmit
  };}
