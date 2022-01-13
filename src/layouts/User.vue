<template>
  <div class="container">
    <div class="sidebar">
      <ul class="sidebar-list">
        <li class="sidebar-list-item">
          <router-link to="/u/dashboard" class="sidebar-list-item-content">
            <i class="content-icon">
              <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21,14V4H3V14H21M21,2A2,2 0 0,1 23,4V16A2,2 0 0,1 21,18H14L16,21V22H8V21L10,18H3C1.89,18 1,17.1 1,16V4C1,2.89 1.89,2 3,2H21M4,5H15V10H4V5M16,5H20V7H16V5M20,8V13H16V8H20M4,11H9V13H4V11M10,11H15V13H10V11Z" />
              </svg>
            </i>
            <span class="content-title">Tableau de bord</span>
          </router-link>
        </li>
        <li class="sidebar-list-item">
          <router-link to="/u/profile" class="sidebar-list-item-content">
            <i class="content-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </i>
            <span class="content-title">Profil</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 70px calc(100vw - 90px);
}

.sidebar {
  min-height: calc(100vh - 51px);
  border-right: 1px solid #ececec;
  transition: all 250ms ease;
}

.sidebar-list {
  list-style-type: none;
  padding: 8px;
  margin: 0;
}

.sidebar-list-item + .sidebar-list-item {
  margin-top: 6px;
}

.sidebar-list-item > .sidebar-list-item-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  color: var(--purple-300);
  font-weight: 500;
  transition: all 250ms ease-in;
}

.sidebar-list-item > .sidebar-list-item-content:hover,
.sidebar-list-item > .sidebar-list-item-content.router-link-exact-active {
  border-radius: 4px;
  background-color: var(--purple-300);
  color: var(--white-200);
}

.sidebar-list-item > .sidebar-list-item-content > .content-icon {
  display: inline-flex;
}

.sidebar-list-item > .sidebar-list-item-content > .content-title {
  display: none;
}

.content {
  padding: 16px;
}

@media (min-width: 768px) {
  .container {
    grid-template-columns: 280px calc(100vw - 300px);
  }

  .sidebar-list-item > .sidebar-list-item-content {
    justify-content: flex-start;
  }

  .sidebar-list-item > .sidebar-list-item-content > .content-icon {
    margin-right: 6px;
  }

  .sidebar-list-item > .sidebar-list-item-content > .content-title {
    display: inline;
  }
}

</style>
