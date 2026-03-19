```markdown
# Design System Strategy: Editorial Brutalism

## 1. Overview & Creative North Star
**Creative North Star: "The Raw Sommelier"**

This design system rejects the "templated" nature of modern hospitality apps in favor of a high-impact, editorial experience. It balances the aggressive, unapologetic structuralism of Brutalism with the refined sophistication of a boutique dining room. We achieve this through "The Raw Sommelier" approach: using stark, unyielding layouts (the "Raw") paired with exquisite typography and a high-fashion color palette (the "Sommelier").

The experience must feel like a physical, printed avant-garde menu. We break the grid intentionally—allowing oversized typography to bleed off-canvas and using extreme contrast to guide the user’s eye. This is not just a digital tool; it is a digital manifestation of the restaurant’s physical atmosphere: edgy, intentional, and unforgettable.

---

## 2. Colors: High-Contrast Vibrancy
Our palette is anchored in the earth (Deep Terracotta) but electrified by the modern (Electric Orange), all set against a canvas of Stark Cream.

*   **Primary (`#a73411`) & Secondary (`#a63b00`):** These represent the "heart" of the kitchen—fire, clay, and intensity. Use `primary` for high-action CTAs and `secondary` for secondary highlights or vibrant accents.
*   **The Backdrop (`#fcf9f3`):** Never use pure white. The `surface` and `background` tokens provide a "stark cream" that feels organic and premium, like heavy-weight cardstock.
*   **The "No-Line" Rule:** In this system, **1px solid borders are strictly prohibited.** To define sections, you must use background color shifts. For example, a menu category section should use `surface-container-low` to distinguish itself from the `surface` background. The eye should perceive boundaries through color blocks, not lines.
*   **Surface Hierarchy:** Use the `surface-container` tiers to create "nested" depth.
    *   *Hero sections:* `surface`
    *   *Content blocks:* `surface-container-low`
    *   *Interactive elements:* `surface-container-high`
*   **Signature Textures:** For hero backgrounds or primary buttons, apply a subtle linear gradient from `primary` to `primary_container`. This adds a "soul" to the flat Brutalist aesthetic, preventing it from feeling sterile.

---

## 3. Typography: The Editorial Voice
The typography is the architecture of this system. We mix the intellectual weight of a high-end serif with the technical precision of a monospaced font.

*   **Display & Headline (Newsreader):** Use these for the "story." These should be oversized. Do not be afraid to use `display-lg` for single words or short phrases. The oversized serifs convey heritage and luxury.
*   **Body & Labels (Space Grotesk):** This monospaced-leaning sans-serif provides the "Brutalist" edge. It feels like a kitchen order ticket or a technical manual. Use `body-md` for descriptions and `label-md` for utility text.
*   **Intentional Friction:** Use `headline-lg` for menu item names and immediately follow with `label-sm` in all-caps for pricing. This juxtaposition of scale creates an "ultra-creative" editorial feel.

---

## 4. Elevation & Depth: Tonal Layering
Because our **roundedness scale is strictly 0px**, we cannot rely on "bubbles" to show depth. We use "The Layering Principle."

*   **Tonal Layering:** Depth is achieved by stacking. Place a `surface-container-lowest` card on top of a `surface-container-low` background. The subtle shift in cream/beige creates a natural lift.
*   **Ambient Shadows:** If an element must float (e.g., a mobile navigation bar), use an extra-diffused shadow.
    *   *Shadow Color:* Use a 6% opacity version of `on-surface`.
    *   *Blur:* 24px–48px. This mimics soft gallery lighting rather than a digital drop-shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` at 15% opacity. It should be felt, not seen.
*   **Glassmorphism:** For overlays or "Sold Out" states, use `surface` with a 70% opacity and a `backdrop-filter: blur(12px)`. This allows the vibrant electric oranges to bleed through the "frosted glass," maintaining a sense of place.

---

## 5. Components: Raw & Functional

*   **Buttons:** 
    *   **Primary:** Sharp 0px corners, `primary` background, `on-primary` text. Use `title-sm` for button labels.
    *   **Tertiary:** No background. Use `title-sm` with an underline that is 2px thick, using the `secondary` color.
*   **Cards (The Menu Item):** 
    *   No borders. No dividers.
    *   Use `surface-container-low` for the card background.
    *   Image should be 100% width, flush to the top and sides (0px radius).
*   **Input Fields:**
    *   Bottom-border only (2px `outline`).
    *   Labels must use `label-md` in `primary` color to stand out against the cream background.
*   **Chips:** 
    *   Rectangular (0px).
    *   Use `secondary_container` for "Chef's Special" tags to provide a pop of "Electric Orange."
*   **Lists:** 
    *   **Forbid Divider Lines.** Use `spacing-6` (2rem) of vertical white space to separate list items. The lack of lines forces the user to engage with the typography as the primary navigational tool.
*   **Signature Component - "The Ticket":** Use for reservation summaries. A `surface-container-highest` vertical block with `body-sm` (Space Grotesk) text, mimicking a thermal printer receipt from the kitchen.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace the Edge:** Let images and text touch the edge of the screen occasionally for a "full-bleed" editorial look.
*   **Exaggerate Scale:** Make headers much larger than you think they should be.
*   **Use Mono for Data:** Use Space Grotesk for anything numerical (prices, times, dates). It looks authoritative and raw.
*   **Utilize Asymmetry:** Offset images or text blocks by using different spacing values (e.g., `spacing-4` on the left, `spacing-8` on the right).

### Don't:
*   **Never Use Border Radius:** Every corner must be a sharp 90-degree angle (0px).
*   **Avoid Softness:** Do not use pastels or soft blurs. Every color choice should be deliberate and high-contrast.
*   **No Standard Grids:** Avoid the "3-column card row" whenever possible. Try a 2-column staggered layout to maintain the boutique, custom feel.
*   **No Dividers:** If you feel the need for a line, use a background color change or more white space instead. Lines are the enemy of this system's raw aesthetic.