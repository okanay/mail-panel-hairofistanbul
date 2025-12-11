import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/task')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <div
        id="desktop-contact-form"
        className="pointer-events-none fixed right-4 bottom-4 hidden flex-col items-end gap-3 md:flex"
      >
        <a href="#" className="pointer-events-auto">
          <img
            src="https://cdn.prod.website-files.com/685522dcb31751b1d39ca69f/6863ed87d7a772b222497689_whatsapp%20(1).svg"
            loading="lazy"
            alt="Hair Of Istanbul - Contact WhatsApp"
            className="size-14"
          />
        </a>
        <a href="#" target="_blank" className="pointer-events-auto">
          <div className="flex items-center gap-x-2 rounded-full bg-linear-to-r from-lime-600 to-green-700 px-4 py-3 text-white">
            <svg
              enableBackground="new 0 0 512 512"
              viewBox="0 0 512 512"
              height="18"
              width="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="m106 512h300c24.814 0 45-20.186 45-45v-317h-105c-24.814 0-45-20.186-45-45v-105h-195c-24.814 0-45 20.186-45 45v422c0 24.814 20.186 45 45 45zm60-301h180c8.291 0 15 6.709 15 15s-6.709 15-15 15h-180c-8.291 0-15-6.709-15-15s6.709-15 15-15zm0 60h180c8.291 0 15 6.709 15 15s-6.709 15-15 15h-180c-8.291 0-15-6.709-15-15s6.709-15 15-15zm0 60h180c8.291 0 15 6.709 15 15s-6.709 15-15 15h-180c-8.291 0-15-6.709-15-15s6.709-15 15-15zm0 60h120c8.291 0 15 6.709 15 15s-6.709 15-15 15h-120c-8.291 0-15-6.709-15-15s6.709-15 15-15z"
              ></path>
              <path
                fill="currentColor"
                d="m346 120h96.211l-111.211-111.211v96.211c0 8.276 6.724 15 15 15z"
              ></path>
            </svg>
            <div className="text-sm font-medium">Book Appointment</div>
          </div>
        </a>
      </div>

      <div
        id="mobile-contact-form"
        className="pointer-events-none fixed bottom-0 left-0 flex w-full items-center justify-between rounded-t-3xl bg-black px-4 py-2 text-xs text-white sm:px-12 sm:text-sm md:hidden"
      >
        <a href="#" className="flex flex-col items-center justify-center gap-y-1">
          <img
            src="https://cdn.prod.website-files.com/685522dcb31751b1d39ca69f/685aa9627f589223c78e09d5_telefon.svg"
            loading="lazy"
            alt="Phone Icon"
            className="size-5"
          />
          <div className="text-color-alternate text-size-small">Call Now</div>
        </a>
        <a
          href="#"
          className="flex items-center justify-center gap-x-2 rounded-lg bg-white px-4 py-2 text-black"
        >
          <img
            src="https://cdn.prod.website-files.com/685522dcb31751b1d39ca69f/685ab05ea6edbccf48572513_icon-form.svg"
            loading="lazy"
            alt="Document Icon"
            className="size-5"
          />
          <div className="text-size-tiny">Free Consultation</div>
        </a>
        <div>
          <a href="#" className="flex flex-col items-center justify-center gap-y-1">
            <img
              src="https://cdn.prod.website-files.com/685522dcb31751b1d39ca69f/685aa9623592776a9beb19b1_whatsapp.svg"
              loading="lazy"
              alt="Hair Of Istanbul - Contact WhatsApp"
              className="size-5"
            />
            <div className="text-color-alternate text-size-small">Whatsapp</div>
          </a>
        </div>
      </div>
    </div>
  )
}
