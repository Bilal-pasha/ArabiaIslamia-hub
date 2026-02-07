'use client';

import { defineStepper } from '@stepperize/react';

/**
 * Registration flow steps for admission form.
 * Step IDs are used with flow.switch() and navigation; title/subtitle/icon for UI.
 */
export const registrationStepper = defineStepper(
  { id: 'personal', title: 'Personal', subtitle: 'Student details', icon: '1' },
  { id: 'guardian', title: 'Guardian', subtitle: 'Parent info', icon: '2' },
  { id: 'academic', title: 'Academic', subtitle: 'Course & education', icon: '3' },
  { id: 'documents', title: 'Documents', subtitle: 'Attach files', icon: '4' }
);

export type RegistrationStepId = 'personal' | 'guardian' | 'academic' | 'documents';

/** Step index (1-based) for validateStep compatibility */
export function stepIdToIndex(id: RegistrationStepId): number {
  const order: RegistrationStepId[] = ['personal', 'guardian', 'academic', 'documents'];
  return order.indexOf(id) + 1;
}

export function indexToStepId(index: number): RegistrationStepId {
  const order: RegistrationStepId[] = ['personal', 'guardian', 'academic', 'documents'];
  const id = order[index - 1];
  return id ?? 'personal';
}
