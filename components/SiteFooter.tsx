import LeavesLayer from "@/components/Leaves/LeavesLayer";

/** Just the leaves: a small thing to do at the end of the page. */
export default function SiteFooter({ leaves = false }: { leaves?: boolean }) {
  if (!leaves) return null;
  return (
    <footer className="leafFooter" id="leaves">
      <LeavesLayer />
    </footer>
  );
}
