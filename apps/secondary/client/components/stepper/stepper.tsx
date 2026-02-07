'use client';

import { registrationStepper } from '@/lib/registration-stepper';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@arabiaaislamia/ui';
import { FormErrorAlert } from '@/components/registration/form-error-alert';
import { RegistrationStepContent } from '@/components/registration/registration-step-content';
import { AdmissionSuccess } from '@/components/admission-success';
import { SubmissionOverlay } from '@/components/registration/submission-overlay';
import { useRegistrationForm } from '@/hooks';

const { Stepper } = registrationStepper;

type StepData = { id: string; title?: string; subtitle?: string; icon?: string };

function StepperTriggerWrapper({
    status,
    index,
}: {
    status: 'success' | 'active' | 'inactive';
    index: number;
}) {
    const isInactive = status === 'inactive';
    const isCompleted = status === 'success';

    return (
        <Stepper.Trigger
            render={(domProps: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
                <Button
                    type="button"
                    className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold border-0"
                    variant={isInactive ? 'outline' : 'default'}
                    {...domProps}
                >
                    <Stepper.Indicator>
                        {isCompleted ? (
                            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            index + 1
                        )}
                    </Stepper.Indicator>
                </Button>
            )}
        />
    );
}

function StepperSeparator({ status, isLast }: { status: string; isLast: boolean }) {
    if (isLast) return null;
    return (
        <Stepper.Separator
            orientation="horizontal"
            data-status={status}
            className="mx-1 h-0.5 flex-1 min-w-[12px] sm:min-w-[20px] bg-white/25 rounded-full overflow-hidden data-[status=success]:bg-primary transition-all duration-300"
        />
    );
}

/** Use inside Stepper.Root so useRegistrationForm gets stepper from context. Renders success or full form layout. */
export function RegistrationPageContent() {
    const {
        formRef,
        stepper,
        data,
        errors,
        files,
        isSubmitting,
        submitted,
        applicationNumber,
        update,
        onFileSelect,
        next,
        prev,
        handleSubmit,
        requestSubmit,
    } = useRegistrationForm();

    if (submitted) {
        return <AdmissionSuccess applicationNumber={applicationNumber} />;
    }

    const currentData = stepper.state.current.data as StepData;

    return (
        <>
            {isSubmitting && <SubmissionOverlay />}
            <form ref={formRef} onSubmit={handleSubmit} className="pb-24 sm:pb-8 space-y-6">
                <Stepper.List className="flex list-none flex-row items-center justify-between w-full py-6 sm:py-8 px-2 sm:px-4">
                    {stepper.state.all.map((stepData: StepData, index: number) => {
                        const currentIndex = stepper.state.current.index;
                        const status = index < currentIndex ? 'success' : index === currentIndex ? 'active' : 'inactive';
                        const isLast = index === stepper.state.all.length - 1;
                        const d = stepData as StepData;
                        return (
                            <Stepper.Item
                                key={stepData.id}
                                step={stepData.id}
                                className="group peer relative flex flex-1 items-center"
                            >
                                <div className="flex flex-col items-center flex-1">
                                    <StepperTriggerWrapper status={status} index={index} />
                                    <span className="mt-2 hidden text-xs font-medium sm:block text-slate-400 group-data-[active]:text-orange-200">
                                        {d.title ?? stepData.id}
                                    </span>
                                </div>
                                <StepperSeparator status={status} isLast={isLast} />
                            </Stepper.Item>
                        );
                    })}
                </Stepper.List>
                <div className="mt-2 text-center sm:hidden">
                    <span className="text-sm font-medium text-white">{currentData.title}</span>
                    <span className="text-slate-300 text-xs ml-1">— {currentData.subtitle}</span>
                </div>

                <Card className="secondary-card overflow-hidden backdrop-blur-xl border border-white/20 w-full min-w-0">
                    <CardHeader className="border-b border-white/15 bg-white/5 pb-6">
                        <CardTitle className="text-xl sm:text-2xl font-semibold text-white">
                            {currentData.title} Information
                        </CardTitle>
                        <p className="text-slate-300 text-sm mt-0.5">{currentData.subtitle}</p>
                    </CardHeader>
                    <CardContent className="pt-6 sm:pt-8">
                        {errors._form && <FormErrorAlert message={errors._form} />}
                        {stepper.flow.switch({
                            personal: () => (
                                <RegistrationStepContent
                                    stepId="personal"
                                    data={data}
                                    errors={errors}
                                    files={files}
                                    onUpdate={update}
                                    onFileSelect={onFileSelect}
                                />
                            ),
                            guardian: () => (
                                <RegistrationStepContent
                                    stepId="guardian"
                                    data={data}
                                    errors={errors}
                                    files={files}
                                    onUpdate={update}
                                    onFileSelect={onFileSelect}
                                />
                            ),
                            academic: () => (
                                <RegistrationStepContent
                                    stepId="academic"
                                    data={data}
                                    errors={errors}
                                    files={files}
                                    onUpdate={update}
                                    onFileSelect={onFileSelect}
                                />
                            ),
                            documents: () => (
                                <RegistrationStepContent
                                    stepId="documents"
                                    data={data}
                                    errors={errors}
                                    files={files}
                                    onUpdate={update}
                                    onFileSelect={onFileSelect}
                                />
                            ),
                        })}
                    </CardContent>
                    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/15 bg-white/5 backdrop-blur-xl py-3 px-3 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:border-0 sm:bg-transparent sm:p-4 sm:px-0">
                        <div className="flex flex-wrap justify-end gap-2 sm:gap-4 sm:px-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prev}
                                disabled={stepper.state.isFirst}
                                className="min-w-[90px] sm:min-w-[120px] disabled:opacity-50 text-sm sm:text-base"
                            >
                                Previous
                            </Button>
                            {!stepper.state.isLast ? (
                                <Button
                                    type="button"
                                    onClick={next}
                                    className="min-w-[90px] sm:min-w-[120px] bg-amber-500 hover:bg-amber-400 text-amber-950 border-0 font-medium text-sm sm:text-base"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={requestSubmit}
                                    className="min-w-[120px] sm:min-w-[160px] bg-amber-500 hover:bg-amber-400 text-amber-950 border-0 font-medium text-sm sm:text-base"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </form>
        </>
    );
}

export function RegistrationStepper() {
    return (
        <Stepper.Root className="w-full min-w-0" orientation="horizontal">
            <RegistrationPageContent />
        </Stepper.Root>
    );
}
