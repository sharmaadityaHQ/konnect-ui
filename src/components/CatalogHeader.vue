<template>
  <header class="catalog-header">
    <div class="header-content">
      <div class="header-top">
        <div class="header-left">
          <img
            alt="Kong"
            class="logo logo-kong"
            src="/images/kong_logo.png"
          >
          <img
            alt="Konnect"
            class="logo logo-konnect"
            src="/images/konnect_logo.png"
          >
        </div>
        <div class="header-right">
          <button class="btn-organization">
            <img
              alt="Organization"
              class="icon-org"
              src="/images/organization_icon.svg"
            >
            <span class="btn-text">Organization</span>
          </button>
          <button class="btn-settings">
            <img
              alt="Settings"
              class="icon-settings"
              src="/images/settings_icon.svg"
            >
            <span class="btn-text">Settings</span>
          </button>
          <div class="user-profile">
            <img
              alt="User"
              class="user-avatar"
              src="/images/default_avatar.svg"
            >
            <span class="user-name">Katherine Ellis</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.catalog-header {
  background-color: #003262;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #fff;
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  margin: 0 auto;
}

.header-top {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.header-left {
  align-items: center;
  display: flex;
  gap: 12px;
}

.logo {
  height: 32px;
  object-fit: contain;
  width: auto;
}

.logo-kong {
  height: 25px;
}

.logo-konnect {
  height: 15px;
}

.header-right {
  align-items: center;
  display: flex;
  gap: 16px;
}

.btn-organization,
.btn-settings {
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  gap: 6px;
  padding: 8px 12px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.user-profile {
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  gap: 8px;
  padding: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.user-avatar {
  height: 30px;
}

.user-name {
  font-size: 14px;
}

// Mobile responsive
@media (max-width: 767px) {
  .catalog-header {
    padding: 12px 16px;
  }

  .header-top {
    align-items: center;
  }

  .header-right {
    font-size: 12px;
    gap: 8px;
  }

  .logo-konnect {
    display: none;
  }

  .logo-kong {
    height: 25px;
  }

  .btn-text {
    display: none;
  }

  .btn-organization,
  .btn-settings {
    min-width: auto;
    padding: 6px 8px;
  }

  .icon-org,
  .icon-settings {
    height: 20px;
  }

  .user-name {
    display: none;
  }
}
</style>
