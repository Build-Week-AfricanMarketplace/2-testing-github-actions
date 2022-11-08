import { closestElement } from "@adc/internal/closest-element";
import { emit } from "@adc/internal/event";
import { FormSubmitController } from "@adc/internal/form";
import { HasSlotController } from "@adc/internal/slot";
import { html, LitElement } from "lit";
import { property, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import style from "./button.css";
import type { PropertyValues, TemplateResult } from "lit";
/**
 * Button
 * @element adc-button
 * @fires adc-click - listens for a click event on the button.
 * @fires adc-focus - listens for a focus event on the button.
 * @fires adc-blur - listens for a blur event on the button.
 * @attr {string} [label-text] - The text-content of the button, could also be
 * @attr {string} [label-text] - The text-content of the button, could also be
 * @attr {string} [label-text] - The text-content of the button, could also be
 * the `<slot>` content.
 * @slot default - text content slot (default)
 * @slot leading-icon - This is a slot for an icon before text.
 * @slot default - text content slot (default)
 * @slot leading-icon - This is a slot for an icon before text.
 * @slot default - text content slot (default)
 * @slot leading-icon - This is a slot for an icon before text.
 * @slot default - text content slot (default)
 * @slot leading-icon - This is a slot for an icon before text.
 * @slot trailing-icon - This is a slot for an icon after text.
 */
export class Button extends LitElement {
  /**
   * @private
   */
  static styles = [style];

  /**
   * @private
   */
  @query("button") buttonNode!: HTMLButtonElement;

  private readonly hasSlotController = new HasSlotController(this, "leading-icon", "trailing-icon");

  private readonly formSubmitController = new FormSubmitController(this, {
    form: (input: HTMLInputElement) => {
      if (input.hasAttribute("form")) {
        const doc = input.getRootNode() as Document | ShadowRoot;
        const formId = input.getAttribute("form")!;

        return doc.getElementById(formId) as HTMLFormElement;
      }

      return input.closest("form");
    }
  });

  /**
   * `true` if the button should have input focus when the page loads.
   * @type {boolean}
   */
  @property({ type: Boolean, reflect: true }) autofocus = false;

  /**
   * `true` if the button should be disabled.
   * @type {boolean}
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The text-content of the button, could also be the `<slot>` content.
   * @attr {string} [label-text]
   * @type {string}
   */
  @property({ attribute: "label-text" }) labelText = "";

  /**
   * Button kind.
   * @type {"primary"|"secondary"|"ghost"}
   */
  @property({ reflect: true }) kind: "primary" | "secondary" | "ghost" = "primary";

  /**
   * Button size.
   * @type {"field"|"fullwidth"|"sm fullwidth"|"sm"|""}
   */
  @property({ reflect: true }) size: "field" | "fullwidth" | "sm fullwidth" | "sm" | "" = "";

  /**
   * The default behavior of a `<button>`.
   * @type {"button" | "submit" | "reset" | "menu"}
   */
  @property({ reflect: true }) type: "button" | "submit" | "reset" | "menu" = "button";

  click() {
    this.buttonNode.click();
  }

  focus(options?: FocusOptions) {
    this.buttonNode.focus(options);
  }

  blur() {
    this.buttonNode.blur();
  }

  handleBlur() {
    emit(this, "adc-blur");
  }

  handleFocus() {
    emit(this, "adc-focus");
  }

  /**
   * @fires click - listens for a click event on the button.
   */
  handleClick() {
    if (this.type === "submit") {
      this.formSubmitController.submit(this);
    }

    emit(this, "adc-click");
  }

  render(): TemplateResult {
    return html`
      <button
        id="button"
        part="interactive"
        class=${classMap({
          "appearance-none": true,
          "bg-blue-060": this.kind.includes("primary"),
          "hover:bg-blue-070": this.kind.includes("primary"),
          "active:bg-blue-080": this.kind.includes("primary"),
          "bg-neutral-140": this.kind.includes("secondary"),
          "bg-transparent": this.kind.includes("ghost"),
          "hover:bg-neutral-130":
            (this.kind.includes("secondary") || this.kind.includes("ghost")) &&
            !!closestElement(".container-default", this),
          "active:bg-neutral-120":
            (this.kind.includes("secondary") || this.kind.includes("ghost")) &&
            !!closestElement(".container-default", this),
          "hover:bg-neutral-120":
            (this.kind.includes("secondary") || this.kind.includes("ghost")) &&
            !!closestElement(".container-secondary", this),
          "active:bg-neutral-110":
            (this.kind.includes("secondary") || this.kind.includes("ghost")) &&
            !!closestElement(".container-secondary", this),
          "hover:bg-neutral-110":
            (this.kind.includes("secondary") || this.kind.includes("ghost")) &&
            !!closestElement(".container-tertiary", this),
          "active:bg-neutral-100":
            (this.kind.includes("secondary") || this.kind.includes("ghost")) &&
            !!closestElement(".container-tertiary", this),
          border: this.kind.includes("secondary"),
          "border-blue-060": this.kind.includes("secondary"),
          "border-solid": this.kind.includes("secondary"),
          "cursor-pointer": true,
          "text-neutral-140": this.kind.includes("primary"),
          "text-blue-060": this.kind.includes("secondary") || this.kind.includes("ghost"),
          flex: true,
          "items-center": true,
          "justify-center": true,
          "gap-12": true,
          "h-48": !this.size.includes("sm"),
          "h-36": this.size.includes("sm"),
          "w-full": this.size.includes("fullwidth"),
          "mt-24": this.size.includes("field"),
          "px-16": true,
          rounded: true,
          "box-border": true,
          "focus:outline-offset-2": true,
          "focus:outline-2": true,
          "focus:outline-blue-070": true,
          "disabled:bg-neutral-090": true,
          "disabled:cursor-default": true,
          "disabled:pointer-events-none": true,
          "adc-button--has-only-icon":
            (this.hasSlotController.test("leading-icon") ||
              this.hasSlotController.test("trailing-icon")) &&
            !this.hasSlotController.test("[default]"),
          "adc-button--has-trailing-icon": this.hasSlotController.test("trailing-icon"),
          "adc-button--has-leading-icon": this.hasSlotController.test("leading-icon")
        })}
        ?autofocus=${this.autofocus}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled ? "true" : "false"}
        type=${this.type}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <slot name="leading-icon"></slot>
        <slot>${this.labelText}</slot>
        <slot name="trailing-icon"></slot>
      </button>
    `;
  }

  updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has("disabled")) {
      if (this.disabled) {
        this.buttonNode.setAttribute("disabled", "disabled");
      } else {
        this.buttonNode.removeAttribute("disabled");
      }
    }
  }
}

try {
  customElements.define("adc-button", Button);
} catch (e) {
  // do nothing
}

declare global {
  interface HTMLElementTagNameMap {
    "adc-button": Button;
  }
}
