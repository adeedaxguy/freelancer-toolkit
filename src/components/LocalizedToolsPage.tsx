import Link from 'next/link'
import LocalizedFeeCalculator from '@/components/LocalizedFeeCalculator'
import { localizedPath, type Locale } from '@/lib/i18n'

export type PageKey = 'home' | 'fiverr' | 'upwork'
const copy = {
  es: {
    home: ['Herramientas gratuitas para freelancers y agencias', 'Calcula tarifas, comisiones y precios de proyectos sin registrarte. Las herramientas se abren rápido y muchos cálculos se realizan en tu navegador.', 'Elige una tarea, introduce tus cifras y utiliza el resultado como punto de partida antes de enviar un presupuesto.'],
    fiverr: ['Calculadora de comisiones de Fiverr', 'Calcula la comisión estimada del vendedor y cuánto recibirías después de la tarifa de plataforma.', 'Introduce el precio del pedido. La estimación usa una comisión del 20%; confirma siempre la tarifa y las condiciones vigentes en Fiverr.'],
    upwork: ['Calculadora de comisiones de Upwork', 'Estima la comisión de servicio y el importe neto que recibirías por un contrato freelance.', 'Introduce el pago bruto. La estimación usa una comisión del 10%; confirma las condiciones actuales de tu contrato en Upwork.'],
    labels: ['Sin registro', 'Cálculo inmediato', 'Datos en tu navegador', 'Calculadora Fiverr', 'Calculadora Upwork'],
  },
  fr: {
    home: ['Outils gratuits pour freelances et agences', 'Calculez vos tarifs, frais et prix de projet sans créer de compte. Les outils sont rapides et de nombreux calculs restent dans votre navigateur.', 'Choisissez une tâche, saisissez vos chiffres et utilisez le résultat comme point de départ avant d’envoyer un devis.'],
    fiverr: ['Calculateur de frais Fiverr', 'Estimez les frais vendeur et le montant reçu après la commission de la plateforme.', 'Saisissez le prix de la commande. L’estimation utilise 20 % de frais ; vérifiez toujours les conditions actuelles sur Fiverr.'],
    upwork: ['Calculateur de frais Upwork', 'Estimez les frais de service et le montant net reçu pour une mission freelance.', 'Saisissez le paiement brut. L’estimation utilise 10 % de frais ; vérifiez les conditions actuelles de votre contrat Upwork.'],
    labels: ['Sans compte', 'Calcul immédiat', 'Données dans le navigateur', 'Calculateur Fiverr', 'Calculateur Upwork'],
  },
  it: {
    home: ['Strumenti gratuiti per freelance e agenzie', 'Calcola tariffe, commissioni e prezzi di progetto senza registrarti. Gli strumenti sono rapidi e molti calcoli restano nel browser.', 'Scegli un’attività, inserisci i numeri e usa il risultato come punto di partenza prima di inviare un preventivo.'],
    fiverr: ['Calcolatore commissioni Fiverr', 'Stima la commissione del venditore e quanto riceveresti dopo la tariffa della piattaforma.', 'Inserisci il prezzo dell’ordine. La stima usa una commissione del 20%; controlla sempre le condizioni correnti su Fiverr.'],
    upwork: ['Calcolatore commissioni Upwork', 'Stima la commissione di servizio e l’importo netto ricevuto per un contratto freelance.', 'Inserisci il pagamento lordo. La stima usa una commissione del 10%; controlla le condizioni correnti del contratto Upwork.'],
    labels: ['Senza account', 'Calcolo immediato', 'Dati nel browser', 'Calcolatore Fiverr', 'Calcolatore Upwork'],
  },
} as const

export default function LocalizedToolsPage({ locale, pageKey }: { locale: Locale; pageKey: PageKey }) {
  const data = copy[locale]
  const [title, description, answer] = data[pageKey]
  const [free, instant, privateLabel, fiverrLabel, upworkLabel] = data.labels
  return <div lang={locale}>
    <section className="border-b border-gray-100 bg-white"><div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-20"><h1 className="text-4xl font-extrabold leading-tight text-gray-950 sm:text-6xl">{title}</h1><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-600">{description}</p><div className="mx-auto mt-6 max-w-3xl rounded-lg border border-brand-100 bg-brand-50 p-5 text-left text-base leading-7 text-gray-800">{answer}</div><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href={localizedPath(locale, '/tools/fiverr-fee-calculator')} className="rounded-full bg-gray-950 px-6 py-3 text-sm font-bold text-white">{fiverrLabel}</Link><Link href={localizedPath(locale, '/tools/upwork-fee-calculator')} className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-900">{upworkLabel}</Link></div></div></section>
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><div className="grid gap-4 sm:grid-cols-3">{[free, instant, privateLabel].map(label => <div key={label} className="rounded-lg border border-gray-200 bg-white p-5"><h2 className="text-lg font-bold text-gray-950">{label}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{answer}</p></div>)}</div>{pageKey !== 'home' && <div className="mx-auto mt-10 max-w-2xl"><LocalizedFeeCalculator locale={locale} platform={pageKey}/></div>}</section>
  </div>
}
