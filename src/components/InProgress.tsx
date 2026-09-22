export default function InProgress() {
  return (
    <div className="flex items-center justify-center h-full flex-col gap-2">
      <h1 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-400">
        Em desenvolvimento...
      </h1>
      <p className="dark:text-zinc-600 text-zinc-500">
        Esta página está em desenvolvimento e será lançada em breve.
      </p>
    </div>
  );
}
