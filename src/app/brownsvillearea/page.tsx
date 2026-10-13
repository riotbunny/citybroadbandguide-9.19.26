"use client";

import { useMemo, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarClock,
  Check,
  ChevronLeft,
  Gauge,
  Languages,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UserRound,
  Wifi,
  XCircle,
} from "lucide-react";

type Language = "en" | "es";
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type Plan = {
  id: string;
  speed: string;
  price: string;
  label: { en: string; es: string };
  bestFor: { en: string; es: string };
  bullets: { en: string[]; es: string[] };
};

const BROWNSVILLE_ZIPS = new Set(["78520", "78521", "78522", "78523", "78526"]);
const TOTAL_STEPS = 8;

const plans: Plan[] = [
  {
    id: "500mbps",
    speed: "500 Mbps",
    price: "$50/mo",
    label: { en: "Smart Starter", es: "Inicio Inteligente" },
    bestFor: {
      en: "Best for streaming, schoolwork, and everyday Wi-Fi.",
      es: "Ideal para streaming, tareas escolares y Wi-Fi diario.",
    },
    bullets: {
      en: ["HD streaming", "Video calls", "Small households"],
      es: ["Streaming HD", "Videollamadas", "Hogares pequenos"],
    },
  },
  {
    id: "1gig",
    speed: "1 Gig",
    price: "$60/mo",
    label: { en: "Most Popular", es: "Mas Popular" },
    bestFor: {
      en: "Built for busy homes, gaming, and multiple devices.",
      es: "Hecho para hogares activos, juegos y varios dispositivos.",
    },
    bullets: {
      en: ["4K streaming", "Gaming-ready", "Work from home"],
      es: ["Streaming 4K", "Listo para juegos", "Trabajo desde casa"],
    },
  },
  {
    id: "2gig",
    speed: "2 Gig",
    price: "$70/mo",
    label: { en: "Power Plan", es: "Plan Potente" },
    bestFor: {
      en: "Maximum speed for large families and heavy usage.",
      es: "Maxima velocidad para familias grandes y alto uso.",
    },
    bullets: {
      en: ["Large households", "Smart homes", "Fast downloads"],
      es: ["Hogares grandes", "Casas inteligentes", "Descargas rapidas"],
    },
  },
];

const copy = {
  en: {
    badge: "Brownsville residents only",
    productKicker: "Private offer engine",
    productSubline: "60-second Brownsville eligibility screen",
    consoleTitle: "Qualification console",
    consoleText: "Answer each checkpoint to unlock the resident-only plan menu.",
    signalItems: ["Address match", "Switch status", "Secure text approval"],
    title: "See if your Brownsville address qualifies for $1 to start.",
    subtitle:
      "Answer a few quick questions. If the address is serviceable, you will receive the secure approval form and installation next steps by text.",
    trust: ["No credit check", "Install fee waived", "First month waived", "$1 starts the order"],
    language: "Espanol",
    steps: ["Address", "Provider", "Offers", "Install", "Name", "Email", "Phone", "Age"],
    continue: "Continue",
    back: "Back",
    submit: "Submit request",
    submitting: "Submitting...",
    required: "Required",
    optional: "Optional",
    step1Title: "Where should we check availability?",
    step1Help: "This offer is limited to Brownsville, TX addresses.",
    address: "Street address",
    addressPlaceholder: "123 E Main St",
    city: "City",
    zip: "ZIP code",
    outsideTitle: "This offer is only for Brownsville, TX.",
    outsideText:
      "Please enter a Brownsville city address with a Brownsville ZIP code to continue.",
    step2Title: "Who is your current internet provider?",
    providerHelp: "This helps us check whether a switch offer may be available.",
    providerPlaceholder: "Select provider",
    currentProviderBlockedTitle: "Sorry, there are no switch offers available here.",
    currentProviderBlockedText:
      "This promotion is reserved for Brownsville residents who are switching from another provider.",
    step3Eyebrow: "Offer unlocked",
    step3Title: "Omni Fiber may be available at",
    step3Help:
      "Choose the plan you want us to request. Final approval depends on serviceability at this address.",
    promoTitle: "Brownsville resident special",
    promoText:
      "$1 starts the order. No credit check. Install fee waived. First month waived when the address is confirmed in footprint.",
    revealTitle: "Your address matched a limited local internet offer.",
    revealText:
      "Select the speed you want below. A scheduler will verify the address and text the secure Omni Fiber approval form if service is available.",
    choosePlanTitle: "Choose your speed",
    choosePlanHelp: "Tap the plan you want, then continue to pick your install window.",
    promoChips: ["$1 to start", "No credit check", "Install waived", "First month waived"],
    selectPlan: "Select this plan",
    selected: "Selected",
    step4Title: "Pick your preferred install window.",
    step4Help: "Schedulers will use this as your preferred time if service is approved.",
    windows: ["8am-12pm", "12pm-4pm", "4pm-9pm"],
    step5Title: "Name as it should appear on the bill.",
    firstName: "First name",
    lastName: "Last name",
    step6Title: "What email should we add?",
    step6Help: "Email is optional. Phone is required on the next step.",
    email: "Email address",
    emailPlaceholder: "you@example.com",
    skipEmail: "Skip email",
    step7Title: "Where should Omni Fiber text your approval?",
    step7Help:
      "This is where you will receive the approval and secure form to process the account and schedule installation.",
    phone: "Mobile phone number",
    phonePlaceholder: "(956) 555-0123",
    step8Title: "Confirm you are 18 or older.",
    step8Help:
      "Omni Fiber requires the account holder to be at least 18. Enter the date of birth for the person whose name will appear on the bill.",
    dateOfBirth: "Date of birth",
    under18Title: "The account holder must be 18 or older.",
    under18Text:
      "Please use the date of birth for an adult account holder to submit this request.",
    consent:
      "By submitting, you agree to be contacted by text or phone about this Brownsville internet request. Message and data rates may apply.",
  },
  es: {
    badge: "Solo residentes de Brownsville",
    productKicker: "Motor privado de ofertas",
    productSubline: "Revision de elegibilidad en Brownsville en 60 segundos",
    consoleTitle: "Consola de calificacion",
    consoleText: "Complete cada punto para desbloquear el menu de planes para residentes.",
    signalItems: ["Direccion valida", "Cambio de proveedor", "Aprobacion por texto"],
    title: "Vea si su direccion en Brownsville califica para comenzar con $1.",
    subtitle:
      "Conteste unas preguntas rapidas. Si la direccion tiene servicio, recibira por texto el formulario seguro de aprobacion y los siguientes pasos.",
    trust: ["Sin verificacion de credito", "Instalacion sin cargo", "Primer mes sin cargo", "$1 inicia la orden"],
    language: "English",
    steps: ["Direccion", "Proveedor", "Ofertas", "Instalacion", "Nombre", "Email", "Telefono", "Edad"],
    continue: "Continuar",
    back: "Atras",
    submit: "Enviar solicitud",
    submitting: "Enviando...",
    required: "Requerido",
    optional: "Opcional",
    step1Title: "Donde revisamos disponibilidad?",
    step1Help: "Esta oferta esta limitada a direcciones en Brownsville, TX.",
    address: "Direccion",
    addressPlaceholder: "123 E Main St",
    city: "Ciudad",
    zip: "Codigo postal",
    outsideTitle: "Esta oferta es solo para Brownsville, TX.",
    outsideText:
      "Ingrese una direccion en la ciudad de Brownsville con un codigo postal de Brownsville para continuar.",
    step2Title: "Quien es su proveedor actual de internet?",
    providerHelp: "Esto nos ayuda a revisar si puede haber una oferta para cambiarse.",
    providerPlaceholder: "Seleccione proveedor",
    currentProviderBlockedTitle: "Lo sentimos, no hay ofertas de cambio disponibles aqui.",
    currentProviderBlockedText:
      "Esta promocion esta reservada para residentes de Brownsville que se estan cambiando de otro proveedor.",
    step3Eyebrow: "Oferta desbloqueada",
    step3Title: "Omni Fiber podria estar disponible en",
    step3Help:
      "Elija el plan que desea solicitar. La aprobacion final depende de disponibilidad de servicio en la direccion.",
    promoTitle: "Especial para residentes de Brownsville",
    promoText:
      "$1 inicia la orden. Sin verificacion de credito. Instalacion sin cargo. Primer mes sin cargo si la direccion esta confirmada en cobertura.",
    revealTitle: "Su direccion coincide con una oferta local limitada de internet.",
    revealText:
      "Seleccione la velocidad que desea. Un programador verificara la direccion y enviara por texto el formulario seguro de aprobacion de Omni Fiber si hay servicio disponible.",
    choosePlanTitle: "Elija su velocidad",
    choosePlanHelp: "Toque el plan que desea y continue para elegir su horario de instalacion.",
    promoChips: ["$1 para comenzar", "Sin credito", "Instalacion sin cargo", "Primer mes sin cargo"],
    selectPlan: "Seleccionar este plan",
    selected: "Seleccionado",
    step4Title: "Elija su horario preferido de instalacion.",
    step4Help: "Los programadores usaran esto como horario preferido si el servicio es aprobado.",
    windows: ["8am-12pm", "12pm-4pm", "4pm-9pm"],
    step5Title: "Nombre como debe aparecer en la factura.",
    firstName: "Nombre",
    lastName: "Apellido",
    step6Title: "Que email desea agregar?",
    step6Help: "El email es opcional. El telefono es requerido en el siguiente paso.",
    email: "Email",
    emailPlaceholder: "usted@ejemplo.com",
    skipEmail: "Omitir email",
    step7Title: "Donde debe Omni Fiber enviar su aprobacion por texto?",
    step7Help:
      "Aqui recibira la aprobacion y el formulario seguro para procesar la cuenta y programar la instalacion.",
    phone: "Numero de celular",
    phonePlaceholder: "(956) 555-0123",
    step8Title: "Confirme que tiene 18 anos o mas.",
    step8Help:
      "Omni Fiber requiere que el titular de la cuenta tenga por lo menos 18 anos. Ingrese la fecha de nacimiento de la persona cuyo nombre aparecera en la factura.",
    dateOfBirth: "Fecha de nacimiento",
    under18Title: "El titular de la cuenta debe tener 18 anos o mas.",
    under18Text:
      "Use la fecha de nacimiento de un titular adulto para enviar esta solicitud.",
    consent:
      "Al enviar, acepta ser contactado por texto o telefono sobre esta solicitud de internet en Brownsville. Pueden aplicar cargos por mensajes y datos.",
  },
};

const CURRENT_PROVIDER_NAME = "Omni Fiber";
const providers = ["Spectrum", "ATT", "Starlink", CURRENT_PROVIDER_NAME, "Other"];

export default function BrownsvilleLandingPage() {
  const router = useRouter();
  const funnelRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    zip: "",
    provider: "",
    planId: "",
    installWindow: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });

  const t = copy[language];
  const selectedPlan = plans.find((plan) => plan.id === formData.planId);
  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const formattedAddress = useMemo(() => {
    const city = formData.city.trim() || "Brownsville";
    const zip = formData.zip.trim();
    return `${formData.address.trim()}, ${city}, TX${zip ? ` ${zip}` : ""}`;
  }, [formData.address, formData.city, formData.zip]);

  const updateField = (name: string, value: string) => {
    setError("");
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const isBrownsvilleAddress = () => {
    const city = formData.city.trim().toLowerCase();
    const zip = formData.zip.trim();
    return city === "brownsville" && BROWNSVILLE_ZIPS.has(zip);
  };

  const isAdultAccountHolder = () => {
    if (!formData.dateOfBirth) return false;

    const birthDate = new Date(`${formData.dateOfBirth}T00:00:00`);
    const today = new Date();
    const eighteenthBirthday = new Date(birthDate);
    eighteenthBirthday.setFullYear(birthDate.getFullYear() + 18);

    return today >= eighteenthBirthday;
  };

  const focusFunnel = () => {
    window.requestAnimationFrame(() => {
      funnelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const goForward = () => {
    if (step === 1) {
      if (!formData.address.trim() || !formData.city.trim() || !formData.zip.trim()) {
        setError(t.outsideText);
        return;
      }
      if (!isBrownsvilleAddress()) {
        setError(t.outsideText);
        return;
      }
    }

    if (step === 2) {
      if (!formData.provider) return;
      if (formData.provider === CURRENT_PROVIDER_NAME) return;
    }

    if (step === 3 && !formData.planId) return;
    if (step === 4 && !formData.installWindow) return;
    if (step === 5 && (!formData.firstName.trim() || !formData.lastName.trim())) return;
    if (step === 7 && !formData.phone.trim()) return;
    if (step === 8 && !isAdultAccountHolder()) {
      setError(t.under18Text);
      return;
    }

    setStep((current) => Math.min(current + 1, TOTAL_STEPS) as Step);
    focusFunnel();
  };

  const goBack = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 1) as Step);
    focusFunnel();
  };

  const handleSubmit = async () => {
    if (!formData.phone.trim() || !isAdultAccountHolder()) {
      setError(t.under18Text);
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "brownsvillearea_multistep_funnel",
          language,
          fullAddress: formattedAddress,
          address: formData.address,
          city: formData.city,
          state: "TX",
          zip: formData.zip,
          currentProvider: formData.provider,
          selectedPlan: selectedPlan
            ? `${selectedPlan.speed} ${selectedPlan.price}`
            : formData.planId,
          installWindow: formData.installWindow,
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          consent: true,
          userAgent: navigator.userAgent,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (submitError) {
      console.error("Error submitting Brownsville lead:", submitError);
    }

    setIsSubmitting(false);
    router.push("/brownsvillearea/thank-you");
  };

  const primaryDisabled =
    (step === 1 && (!formData.address.trim() || !formData.city.trim() || !formData.zip.trim())) ||
    (step === 2 && (!formData.provider || formData.provider === CURRENT_PROVIDER_NAME)) ||
    (step === 3 && !formData.planId) ||
    (step === 4 && !formData.installWindow) ||
    (step === 5 && (!formData.firstName.trim() || !formData.lastName.trim())) ||
    (step === 7 && !formData.phone.trim()) ||
    isSubmitting;

  return (
    <main className="min-h-screen bg-[#050712] text-slate-950 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:34px_34px]">
      <section className="relative overflow-hidden px-4 pb-8 pt-5 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#07111f_0%,#0a2740_44%,#0f172a_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,#050712)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-[11px] font-black uppercase tracking-widest text-sky-100 shadow-2xl shadow-black/20">
              <Sparkles className="h-3.5 w-3.5 text-orange-300" />
              {t.productKicker}
            </div>
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-3 py-2 text-xs font-black text-slate-950 shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
            >
              <Languages className="h-4 w-4 text-orange-600" />
              {t.language}
            </button>
          </div>

          <div className="grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-16">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-sky-300/20 bg-sky-300/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-sky-100">
                <MapPin className="h-4 w-4 text-orange-300" />
                {t.badge}
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                {t.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-slate-300 sm:text-lg">
                {t.subtitle}
              </p>
              <div className="mt-7 grid grid-cols-2 gap-2 sm:max-w-2xl sm:grid-cols-4">
                {t.trust.map((item) => (
                  <div
                    key={item}
                    className="min-h-16 rounded-[1.15rem] border border-white/10 bg-white/[0.08] px-3 py-3 text-xs font-black leading-tight text-white shadow-lg shadow-black/10 backdrop-blur"
                  >
                    <Check className="mb-2 h-4 w-4 text-emerald-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200">
                      {t.productSubline}
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                      {t.consoleTitle}
                    </h2>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-300">
                      {t.consoleText}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400 text-slate-950">
                    <Gauge className="h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-3">
                  {t.signalItems.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-950">
                        {index === 0 && <MapPin className="h-4 w-4" />}
                        {index === 1 && <Wifi className="h-4 w-4" />}
                        {index === 2 && <LockKeyhole className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-white">{item}</p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-300 to-emerald-300"
                            style={{ width: `${Math.min(100, 34 + index * 28)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-300">OK</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={funnelRef} className="relative mx-auto max-w-6xl px-4 pb-12 lg:-mt-8">
        <div className="grid gap-5 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
          <aside className="hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-xl lg:block">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-400 text-slate-950">
                <TimerReset className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {t.consoleTitle}
                </p>
                <p className="text-lg font-black">{t.steps[step - 1]}</p>
              </div>
            </div>
            <div className="space-y-2">
              {t.steps.map((label, index) => {
                const isActive = index + 1 === step;
                const isDone = index + 1 < step;
                return (
                  <div
                    key={label}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-black ${
                      isActive
                        ? "border-orange-300 bg-orange-300 text-slate-950"
                        : isDone
                          ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                          : "border-white/10 bg-white/[0.04] text-slate-400"
                    }`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs text-slate-950">
                      {isDone ? <Check className="h-4 w-4" /> : index + 1}
                    </span>
                    {label}
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
            <div className="border-b border-slate-200 bg-[#f8fafc] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Step {step} / {TOTAL_STEPS}
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-950">
                    {t.steps[step - 1]}
                  </p>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-500">
                  {progress}%
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

          <div className="p-5 sm:p-8">
            {step === 1 && (
              <StepPanel icon={<MapPin />} title={t.step1Title} help={t.step1Help}>
                <Field
                  label={t.address}
                  status={t.required}
                  value={formData.address}
                  placeholder={t.addressPlaceholder}
                  autoComplete="street-address"
                  onChange={(value) => updateField("address", value)}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px]">
                  <Field
                    label={t.city}
                    status={t.required}
                    value={formData.city}
                    placeholder="Brownsville"
                    autoComplete="address-level2"
                    onChange={(value) => updateField("city", value)}
                  />
                  <Field
                    label={t.zip}
                    status={t.required}
                    value={formData.zip}
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="78520"
                    autoComplete="postal-code"
                    onChange={(value) => updateField("zip", value.replace(/\D/g, ""))}
                  />
                </div>
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                    <div className="mb-1 flex items-center gap-2 text-red-800">
                      <XCircle className="h-4 w-4" />
                      {t.outsideTitle}
                    </div>
                    {error}
                  </div>
                )}
              </StepPanel>
            )}

            {step === 2 && (
              <StepPanel icon={<Wifi />} title={t.step2Title} help={t.providerHelp}>
                <label className="block">
                  <span className="mb-2 flex items-center justify-between text-sm font-black text-slate-800">
                    <span>{t.step2Title}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      {t.required}
                    </span>
                  </span>
                  <select
                    value={formData.provider}
                    onChange={(event) => updateField("provider", event.target.value)}
                    className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-extrabold text-slate-950 outline-none ring-orange-500 transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="">{t.providerPlaceholder}</option>
                    {providers.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                </label>

                {formData.provider === CURRENT_PROVIDER_NAME && (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                    <div className="mb-2 flex items-center gap-2 font-black text-amber-900">
                      <XCircle className="h-5 w-5" />
                      {t.currentProviderBlockedTitle}
                    </div>
                    <p className="text-sm font-semibold leading-relaxed text-amber-800">
                      {t.currentProviderBlockedText}
                    </p>
                  </div>
                )}
              </StepPanel>
            )}

            {step === 3 && (
              <StepPanel
                icon={<PartyPopper />}
                eyebrow={t.step3Eyebrow}
                title={t.step3Title}
                highlightedText={formattedAddress}
                help={t.step3Help}
              >
                <div className="overflow-hidden rounded-[1.75rem] border border-[#6d22ff]/25 bg-gradient-to-br from-[#f4efff] via-white to-[#eef7ff] shadow-xl shadow-[#6d22ff]/15">
                  <div className="border-b border-white/20 bg-gradient-to-r from-[#5d16f2] via-[#6f22ff] to-[#2563eb] px-5 py-4 text-white">
                    <div className="flex items-center gap-4">
                      <div className="flex min-h-16 w-32 items-center justify-center rounded-2xl bg-white px-3 shadow-xl shadow-black/15">
                        <Image
                          src="/logos/omni-fiber-logo.png"
                          alt="Omni Fiber"
                          width={200}
                          height={70}
                          className="max-h-11 w-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-violet-100">
                          {t.promoTitle}
                        </p>
                        <h3 className="text-xl font-black leading-tight">
                          {t.revealTitle}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <p className="text-sm font-semibold leading-relaxed text-slate-700">
                      {t.revealText}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {t.promoChips.map((chip) => (
                        <div
                          key={chip}
                          className="flex min-h-12 items-center justify-center rounded-2xl border border-[#6d22ff]/15 bg-white px-3 text-center text-xs font-black text-slate-800"
                        >
                          {chip}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-[#6d22ff]/15 bg-white/80 p-4 shadow-sm">
                      <div className="mb-2 flex items-center gap-2 text-sm font-black text-[#371085]">
                        <ShieldCheck className="h-4 w-4 text-[#6d22ff]" />
                        {t.promoTitle}
                      </div>
                      <p className="text-sm font-semibold leading-relaxed text-slate-700">
                        {t.promoText}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-xl font-black tracking-tight text-slate-950">
                    {t.choosePlanTitle}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600">
                    {t.choosePlanHelp}
                  </p>
                </div>

                <div className="grid gap-4">
                  {plans.map((plan) => {
                    const isSelected = formData.planId === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => updateField("planId", plan.id)}
                        className={`rounded-3xl border p-5 text-left transition active:scale-[0.99] ${
                          isSelected
                            ? "border-[#6d22ff] bg-[#f4efff] shadow-lg shadow-[#6d22ff]/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest text-[#6d22ff]">
                              {plan.label[language]}
                            </p>
                            <h3 className="mt-1 text-3xl font-black text-slate-950">
                              {plan.speed}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-black text-slate-950">{plan.price}</p>
                            <p className="text-xs font-bold text-slate-500">plus $1 start</p>
                          </div>
                        </div>
                        <p className="mb-4 text-sm font-semibold leading-relaxed text-slate-600">
                          {plan.bestFor[language]}
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          {plan.bullets[language].map((bullet) => (
                            <span
                              key={bullet}
                              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700"
                            >
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              {bullet}
                            </span>
                          ))}
                        </div>
                        <div
                          className={`mt-4 rounded-2xl px-4 py-3 text-center text-sm font-black ${
                            isSelected
                              ? "bg-[#6d22ff] text-white"
                              : "bg-slate-950 text-white"
                          }`}
                        >
                          {isSelected ? t.selected : t.selectPlan}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </StepPanel>
            )}

            {step === 4 && (
              <StepPanel icon={<CalendarClock />} title={t.step4Title} help={t.step4Help}>
                <div className="grid gap-3">
                  {t.windows.map((windowLabel) => (
                    <ChoiceButton
                      key={windowLabel}
                      selected={formData.installWindow === windowLabel}
                      onClick={() => updateField("installWindow", windowLabel)}
                    >
                      {windowLabel}
                    </ChoiceButton>
                  ))}
                </div>
              </StepPanel>
            )}

            {step === 5 && (
              <StepPanel icon={<UserRound />} title={t.step5Title}>
                <Field
                  label={t.firstName}
                  status={t.required}
                  value={formData.firstName}
                  autoComplete="given-name"
                  onChange={(value) => updateField("firstName", value)}
                />
                <Field
                  label={t.lastName}
                  status={t.required}
                  value={formData.lastName}
                  autoComplete="family-name"
                  onChange={(value) => updateField("lastName", value)}
                />
              </StepPanel>
            )}

            {step === 6 && (
              <StepPanel icon={<Mail />} title={t.step6Title} help={t.step6Help}>
                <Field
                  label={t.email}
                  status={t.optional}
                  type="email"
                  value={formData.email}
                  placeholder={t.emailPlaceholder}
                  autoComplete="email"
                  onChange={(value) => updateField("email", value)}
                />
              </StepPanel>
            )}

            {step === 7 && (
              <StepPanel icon={<Phone />} title={t.step7Title} help={t.step7Help}>
                <Field
                  label={t.phone}
                  status={t.required}
                  type="tel"
                  value={formData.phone}
                  placeholder={t.phonePlaceholder}
                  autoComplete="tel"
                  inputMode="tel"
                  onChange={(value) => updateField("phone", value)}
                />
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold leading-relaxed text-slate-600">
                  {t.consent}
                </div>
              </StepPanel>
            )}

            {step === 8 && (
              <StepPanel icon={<ShieldCheck />} title={t.step8Title} help={t.step8Help}>
                <Field
                  label={t.dateOfBirth}
                  status={t.required}
                  type="date"
                  value={formData.dateOfBirth}
                  autoComplete="bday"
                  onChange={(value) => updateField("dateOfBirth", value)}
                />
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                    <div className="mb-1 flex items-center gap-2 text-red-800">
                      <XCircle className="h-4 w-4" />
                      {t.under18Title}
                    </div>
                    {error}
                  </div>
                )}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold leading-relaxed text-slate-600">
                  {t.consent}
                </div>
              </StepPanel>
            )}
          </div>

          <div className="sticky bottom-0 border-t border-slate-100 bg-white/95 p-4 backdrop-blur">
            <div className="mx-auto flex max-w-2xl gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <ChevronLeft className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">{t.back}</span>
                </button>
              )}

              {step === 6 ? (
                <button
                  type="button"
                  onClick={goForward}
                  className="h-14 flex-1 rounded-2xl bg-slate-950 px-5 text-base font-black text-white shadow-xl shadow-slate-300 transition hover:bg-slate-800 active:scale-[0.99]"
                >
                  {formData.email.trim() ? t.continue : t.skipEmail}
                </button>
              ) : step === 8 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={primaryDisabled}
                  className="h-14 flex-1 rounded-2xl bg-[#ff6a1a] px-5 text-base font-black text-white shadow-xl shadow-orange-200 transition hover:bg-[#f05e10] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isSubmitting ? t.submitting : t.submit}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goForward}
                  disabled={primaryDisabled}
                  className="inline-flex h-14 flex-1 items-center justify-center rounded-2xl bg-[#ff6a1a] px-5 text-base font-black text-white shadow-xl shadow-orange-200 transition hover:bg-[#f05e10] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {t.continue}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}

function StepPanel({
  icon,
  eyebrow,
  title,
  highlightedText,
  help,
  children,
}: {
  icon: ReactNode;
  eyebrow?: string;
  title: string;
  highlightedText?: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 text-orange-300 shadow-xl shadow-slate-200 [&_svg]:h-7 [&_svg]:w-7">
          {icon}
        </div>
        {eyebrow && (
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-orange-600">
            {eyebrow}
          </p>
        )}
        <h2 className="text-[2rem] font-black leading-[1.02] tracking-tight text-slate-950 sm:text-4xl">
          {title}
          {highlightedText && (
            <>
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-sky-700 bg-clip-text text-transparent">
                {highlightedText}
              </span>
            </>
          )}
        </h2>
        {help && <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-600">{help}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  status,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  maxLength,
}: {
  label: string;
  status: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  maxLength?: number;
}) {
  const inputId = `brownsville-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="block">
      <label
        htmlFor={inputId}
        className="mb-2 flex items-center justify-between text-sm font-black text-slate-800"
      >
        <span>{label}</span>
        <span className="text-[11px] font-black uppercase tracking-widest text-orange-600">
          {status}
        </span>
      </label>
      <input
        id={inputId}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-16 w-full rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 text-base font-extrabold text-slate-950 outline-none ring-orange-500 transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
      />
    </div>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-16 items-center justify-between rounded-[1.15rem] border px-5 text-left text-lg font-black transition active:scale-[0.99] ${
        selected
          ? "border-orange-500 bg-orange-50 text-slate-950 shadow-lg shadow-orange-100"
          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span>{children}</span>
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full border ${
          selected ? "border-orange-500 bg-orange-500 text-white" : "border-slate-300"
        }`}
      >
        {selected && <Check className="h-4 w-4" />}
      </span>
    </button>
  );
}
