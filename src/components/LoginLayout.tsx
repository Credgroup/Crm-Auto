import { Outlet } from "react-router-dom";

export function LoginLayout() {
  const platVersion = import.meta.env.VITE_IMAGE_VERSION ?? "0.0.0";
  const year = new Date().getFullYear();
  return (
    <main className="h-screen w-screen flex">
      <div className="w-full h-full py-4 pl-4 pr-2 hidden lg:block">
        <div className="relative w-full h-full overflow-hidden rounded-2xl bg-zinc-950">
          <img src="/assets/branding/login-trucks-cover.png" alt="Caminhão em centro logístico" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/10 to-black/55" />
          <div className="absolute left-10 top-10 rounded-2xl border border-white/15 bg-black/30 p-6 shadow-2xl backdrop-blur-md">
            <div className="h-14 w-64 bg-[image:var(--image-logo-extended-dark)] bg-contain bg-left bg-no-repeat" />
            <div className="my-5 h-px bg-white/20" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">Powered by</span>
              <div className="rounded-lg bg-white px-3 py-2">
                <img src="/assets/branding/ekio-logo.png" alt="Ekio" className="h-7 w-auto object-contain" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-10 max-w-xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Finance &amp; Insurance</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight">Do caminhão escolhido à operação protegida.</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">Uma jornada integrada de crédito, seguro e serviços para acelerar cada negócio.</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center flex-col h-full w-full lg:max-w-xl py-4 px-4 lg:pl-2 lg:pr-4">
        <header className="w-full flex items-center justify-between"></header>
        <Outlet />
        <footer className="w-full flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-600">
          <p className="">&copy; 2018 - {year} Ekio</p>
          <p>V{platVersion}</p>
        </footer>
      </div>
    </main>
  );
}
