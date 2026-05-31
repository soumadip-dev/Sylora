const pageWrapClass = 'min-h-screen bg-background';
const contentContainerClass = 'mx-auto max-w-7xl px-4 py-8';
const uploadPanelClass = 'grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]';

export default function AdminSettings() {
  return (
    <div className={pageWrapClass}>
      <div className={contentContainerClass}>
        <div className={uploadPanelClass}>ADMIN SETTINGS</div>
      </div>
    </div>
  );
}
