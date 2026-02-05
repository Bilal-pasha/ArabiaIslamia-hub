'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Button } from '@/client/components/atoms';
import { FormField } from '@/client/components/molecules';

const donateSchema = z.object({
  firstname: z.string().min(1, 'Please enter your first name'),
  lastname: z.string().min(1, 'Please enter your last name'),
  cellnumber: z.string().min(1, 'Please enter your cell number').max(15, 'Use 15 characters or less'),
  email: z.string().email('Please enter a valid email address'),
  city: z.string().min(1, 'Please enter your city'),
  donation: z.string().min(1, 'Please enter your contribution amount'),
  message: z.string().min(1, 'Please enter a message'),
});

type DonateFormData = z.infer<typeof donateSchema>;

export function DonateFormSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonateFormData>({
    resolver: zodResolver(donateSchema),
  });

  const onSubmit = (data: DonateFormData) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

  return (
    <section className="bg-pattern-lite bg-[#fffcfc] px-4 py-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 text-center text-[#695300]">
            <p className="text-sm lg:text-base">
              Donate{' '}
              <span className="animate-pulse bg-amber-500 px-2 py-1 text-white">
                Today
              </span>
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground lg:text-5xl">
              Join Our Mission
            </h2>
            <p className="mt-2 text-muted-foreground">
              Make a difference today and be a part of something truly special.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6 sm:grid-cols-2"
          >
            <FormField
              label="First Name"
              name="firstname"
              placeholder="First Name"
              required
              error={errors.firstname?.message}
              register={register}
            />
            <FormField
              label="Last Name"
              name="lastname"
              placeholder="Last Name"
              required
              error={errors.lastname?.message}
              register={register}
            />
            <FormField
              label="Cell Number"
              name="cellnumber"
              placeholder="Cell Number"
              required
              error={errors.cellnumber?.message}
              register={register}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="Email address"
              required
              error={errors.email?.message}
              register={register}
            />
            <FormField
              label="City"
              name="city"
              placeholder="City"
              required
              error={errors.city?.message}
              register={register}
            />
            <FormField
              label="Contribution Amount"
              name="donation"
              type="number"
              placeholder="Contribution Amount"
              required
              error={errors.donation?.message}
              register={register}
            />
            <div className="sm:col-span-2">
              <FormField
                label="Message"
                name="message"
                placeholder="Message"
                required
                multiline
                rows={3}
                error={errors.message?.message}
                register={register}
              />
            </div>
            <div className="sm:col-span-2 flex justify-center">
              <Button type="submit">Donate now</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
