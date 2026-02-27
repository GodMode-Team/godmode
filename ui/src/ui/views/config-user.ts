import { html, nothing } from "lit";

export type UserSettingsProps = {
  userName: string;
  userAvatar: string | null;
  onUpdate: (name: string, avatar: string) => void;
};

/**
 * Resizes an image file to a square thumbnail.
 * Centers and crops to square, then resizes to maxSize.
 */
function resizeImage(file: File, maxSize = 128): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = maxSize;
      canvas.height = maxSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      // Center crop to square
      const size = Math.min(img.width, img.height);
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;
      ctx.drawImage(img, x, y, size, size, 0, 0, maxSize, maxSize);
      resolve(canvas.toDataURL("image/png"));
    });
    img.addEventListener("error", () => reject(new Error("Failed to load image")));
    img.src = URL.createObjectURL(file);
  });
}

// Track local state for the form
let localName = "";
let localAvatar: string | null = null;
let avatarPreview: string | null = null;
let initialized = false;
let hasChanges = false;

function initializeState(props: UserSettingsProps) {
  if (!initialized) {
    localName = props.userName || "";
    localAvatar = props.userAvatar || null;
    avatarPreview = props.userAvatar || null;
    initialized = true;
    hasChanges = false;
  }
}

function resetState() {
  initialized = false;
  hasChanges = false;
}

export function renderUserSettings(props: UserSettingsProps) {
  initializeState(props);

  const handleNameChange = (e: Event) => {
    localName = (e.target as HTMLInputElement).value;
    hasChanges = true;
  };

  const handleFileSelect = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB before resize)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    try {
      const resized = await resizeImage(file, 128);
      localAvatar = resized;
      avatarPreview = resized;
      hasChanges = true;
      // Force re-render by dispatching a custom event
      document.dispatchEvent(new CustomEvent("user-settings-updated"));
    } catch (err) {
      console.error("Failed to process image:", err);
      alert("Failed to process image");
    }
  };

  const handleClearAvatar = () => {
    localAvatar = null;
    avatarPreview = null;
    hasChanges = true;
    // Clear the file input
    const input = document.getElementById("user-avatar-input") as HTMLInputElement;
    if (input) {
      input.value = "";
    }
    document.dispatchEvent(new CustomEvent("user-settings-updated"));
  };

  const handleSave = () => {
    props.onUpdate(localName, localAvatar || "");
    hasChanges = false;
    // Show saved feedback
    const btn = document.querySelector(".user-settings__save") as HTMLButtonElement;
    if (btn) {
      btn.textContent = "Saved!";
      setTimeout(() => {
        btn.textContent = "Save";
      }, 1500);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    localName = props.userName || "";
    localAvatar = props.userAvatar || null;
    avatarPreview = props.userAvatar || null;
    hasChanges = false;
    document.dispatchEvent(new CustomEvent("user-settings-updated"));
  };

  // Determine avatar display
  const displayName = localName || "You";
  const avatarContent = avatarPreview
    ? html`<img src="${avatarPreview}" alt="${displayName}" class="user-settings__avatar-img" />`
    : html`<span class="user-settings__avatar-initial">${displayName.charAt(0).toUpperCase()}</span>`;

  return html`
    <div class="user-settings">
      <section class="config-section-card">
        <div class="config-section-card__header">
          <span class="config-section-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <div class="config-section-card__titles">
            <h3 class="config-section-card__title">User Profile</h3>
            <p class="config-section-card__desc">Your display name and avatar for chat messages</p>
          </div>
        </div>
        <div class="config-section-card__content">
          <div class="user-settings__form">
            <!-- Avatar Section -->
            <div class="user-settings__field">
              <label class="user-settings__label">Avatar</label>
              <div class="user-settings__avatar-row">
                <div class="user-settings__avatar-preview">
                  ${avatarContent}
                </div>
                <div class="user-settings__avatar-actions">
                  <input
                    type="file"
                    id="user-avatar-input"
                    accept="image/*"
                    class="user-settings__file-input"
                    @change=${handleFileSelect}
                  />
                  <button
                    type="button"
                    class="user-settings__btn user-settings__btn--upload"
                    @click=${() => document.getElementById("user-avatar-input")?.click()}
                  >
                    Choose Image
                  </button>
                  ${
                    avatarPreview
                      ? html`
                        <button
                          type="button"
                          class="user-settings__btn user-settings__btn--clear"
                          @click=${handleClearAvatar}
                        >
                          Remove
                        </button>
                      `
                      : nothing
                  }
                </div>
              </div>
              <span class="user-settings__hint">Square images work best. Will be resized to 128x128.</span>
            </div>

            <!-- Name Section -->
            <div class="user-settings__field">
              <label class="user-settings__label" for="user-name-input">Display Name</label>
              <input
                type="text"
                id="user-name-input"
                class="user-settings__input"
                .value=${localName}
                @input=${handleNameChange}
                placeholder="Your name"
                maxlength="50"
              />
              <span class="user-settings__hint">This name appears on your chat messages</span>
            </div>

            <!-- Actions -->
            <div class="user-settings__actions">
              ${
                hasChanges
                  ? html`
                    <button
                      type="button"
                      class="user-settings__btn user-settings__btn--cancel"
                      @click=${handleCancel}
                    >
                      Cancel
                    </button>
                  `
                  : nothing
              }
              <button
                type="button"
                class="user-settings__btn user-settings__btn--save user-settings__save"
                ?disabled=${!hasChanges}
                @click=${handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

// Export reset function for when leaving the section
export { resetState as resetUserSettingsState };
