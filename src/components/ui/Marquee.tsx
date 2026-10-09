/**
 * Marquee — horizontally looping tech-token track with edge fade mask.
 *
 * The `.marquee` wrapper provides the `mask-image` fade-out on both edges
 * (defined in index.css). The `.marquee-track` inside it carries the
 * `marquee` keyframe animation that translates by -50% to loop seamlessly.
 *
 * To achieve a seamless loop the track renders the items list twice:
 *   [items][items]
 * The animation translates the track by exactly -50% (the width of one set),
 * then restarts — producing an infinite visual loop with no jump.
 *
 * The duplicate set is `aria-hidden="true"` so screen readers only encounter
 * each label once.
 *
 * Under `prefers-reduced-motion: reduce` the CSS in index.css already disables
 * the `marquee-track` animation — this component does not need to branch.
 */

type Props = {
  /** List of tech/skill token strings to display in the scrolling track. */
  items: string[]
}

export default function Marquee({ items }: Props) {
  // One visual "set" of items, each followed by an accent dot separator.
  const renderSet = (hidden: boolean) =>
    items.map((item, i) => (
      <span
        key={`${hidden ? 'dup' : 'set'}-${i}`}
        className="marquee-item"
        aria-hidden={hidden ? 'true' : undefined}
      >
        {item}
        <span className="marquee-dot" aria-hidden="true" />
      </span>
    ))

  return (
    <div className="marquee reveal" data-reveal="fade" aria-hidden="true">
      <div className="marquee-track">
        {renderSet(false)}
        {/* Duplicate set for a seamless -50% loop. */}
        {renderSet(true)}
      </div>
    </div>
  )
}
