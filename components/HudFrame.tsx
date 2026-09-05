/**
 * Global decorative HUD frame.
 *
 * Contains:
 * - Four viewport corner brackets
 * - System status indicator
 *
 * The navigation is handled separately by SiteNav.
 *
 * AES / encryption readout has intentionally been removed.
 */

export default function HudFrame() {
  return (
    <div
      className="hud-frame"
      aria-hidden="true"
    >

      {/* =====================================================
          CORNER BRACKETS
      ===================================================== */}

      <span className="hud-corner hud-corner-tl" />

      <span className="hud-corner hud-corner-tr" />

      <span className="hud-corner hud-corner-bl" />

      <span className="hud-corner hud-corner-br" />


      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}

      <div className="hud-readout hud-readout-left">

        <span>
          SYS // PHOSDEEP
        </span>

        <span className="hud-blink">
          ● ONLINE
        </span>

      </div>

    </div>
  );
}