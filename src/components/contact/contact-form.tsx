"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { SelectField } from "@/components/shared/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTACT_EMAIL } from "@/lib/constants";
import {
  CONTACT_TOPICS,
  contactSchema,
  type ContactValues,
} from "@/lib/validators/contact";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", topic: "", message: "" },
  });

  // There is no mail server behind this page: the message opens in the
  // visitor's own email app, addressed to the registrar's office
  function onSubmit(values: ContactValues) {
    const topic = CONTACT_TOPICS.find((item) => item.value === values.topic)?.label ?? "Enquiry";
    const subject = `${topic}: message from ${values.name}`;
    const body = `${values.message}\n\n${values.name}\n${values.email}`;

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success("Opening your email app. Press send there to finish.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Your name" htmlFor="contact-name" error={errors.name?.message}>
          <Input id="contact-name" autoComplete="name" {...register("name")} />
        </FormField>
        <FormField label="Email" htmlFor="contact-email" error={errors.email?.message}>
          <Input id="contact-email" type="email" autoComplete="email" {...register("email")} />
        </FormField>
      </div>

      <FormField label="What is it about?" htmlFor="contact-topic" error={errors.topic?.message}>
        <Controller
          control={control}
          name="topic"
          render={({ field }) => (
            <SelectField
              id="contact-topic"
              value={field.value}
              onChange={field.onChange}
              placeholder="Choose a topic"
              options={CONTACT_TOPICS}
            />
          )}
        />
      </FormField>

      <FormField label="Your message" htmlFor="contact-message" error={errors.message?.message}>
        <textarea
          id="contact-message"
          rows={6}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          {...register("message")}
        />
      </FormField>

      <Button type="submit" size="lg">
        Write to the registrar
      </Button>
    </form>
  );
}
