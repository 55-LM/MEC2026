import './GridBackground.css';

/**
 * Continuous engineering grid + subtle static noise behind the entire site.
 * Positioned absolutely within #root so it scrolls with page content.
 * About freezes it (counter-translate) while that section is pinned.
 * pointer-events: none so it never intercepts interaction.
 */
export function GridBackground() {
  return (
    <div className="grid-background" aria-hidden="true">
      <div className="grid-background__pattern" />
      <div className="grid-background__noise" />
    </div>
  );
}
