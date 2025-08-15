<template>
  <div class="admin-page">
    <!-- Header -->
    <header class="admin-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="admin-title">
            <i class="pi pi-crown"></i>
            Admin Panel
          </h1>
          <p class="admin-subtitle">Manage users and application settings</p>
        </div>
        <div class="header-right">
          <div class="admin-info">
            <span class="admin-email">{{ currentUserEmail }}</span>
            <span class="admin-role">Administrator</span>
          </div>
          <button class="logout-btn" @click="handleLogout">
            <i class="pi pi-sign-out"></i>
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="admin-main">
      <div class="admin-container">
        <TabView v-model:activeIndex="activeTab" class="admin-tabs">
          
          <!-- User Management Tab -->
          <TabPanel>
            <template #header>
              <i class="pi pi-users"></i>
              <span>User Management</span>
            </template>
            
            <div class="tab-content">
              <!-- User List -->
              <div class="user-list-section">
                <h3>
                  <i class="pi pi-list"></i>
                  All Users
                </h3>
                
                <!-- Search Bar -->
                <div class="user-search-container">
                  <div class="search-input-wrapper">
                    <i class="pi pi-search search-icon"></i>
                    <input 
                      type="text" 
                      v-model="userSearch" 
                      placeholder="Search users by name or email..." 
                      class="user-search-input"
                    >
                    <button 
                      v-if="userSearch" 
                      @click="userSearch = ''" 
                      class="clear-search-btn"
                      type="button"
                    >
                      <i class="pi pi-times"></i>
                    </button>
                  </div>
                  <div v-if="userSearch && filteredUsersList.length === 0" class="no-results">
                    <i class="pi pi-search-minus"></i>
                    <span>No users found matching "{{ userSearch }}"</span>
                  </div>
                </div>
                
                <div v-if="loading" class="loading-state">
                  <i class="pi pi-spinner pi-spin"></i>
                  <span>Loading users...</span>
                </div>
                
                <div v-else class="user-grid">
                  <div v-for="user in filteredUsersList" :key="user.id" class="user-card">
                    <div class="user-avatar">
                      <i class="pi pi-user"></i>
                    </div>
                    <div class="user-info">
                      <h4 class="user-name">
                        <i class="pi pi-user user-icon"></i>
                        {{ getFullName(user) }}
                      </h4>
                      <p class="user-email">{{ user.email }}</p>
                      <div class="user-badges">
                        <span v-if="user.isAdmin" class="badge admin">
                          <i class="pi pi-crown"></i>
                          Administrator
                        </span>
                        <span v-if="user.hasHealthData" class="badge data">
                          <i class="pi pi-chart-bar"></i>
                          Has Health Data
                        </span>
                        <span v-else class="badge inactive">
                          <i class="pi pi-clock"></i>
                          Pending Data
                        </span>
                      </div>
                    </div>
                    <div class="user-actions">
                      <button 
                        @click="viewUserDetails(user)"
                        class="action-btn details"
                        title="View user details"
                      >
                        <i class="pi pi-eye"></i>
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Statistics Tab -->
          <TabPanel>
            <template #header>
              <i class="pi pi-chart-line"></i>
              <span>Analytics</span>
            </template>
            
            <div class="tab-content">
              <div class="stats-overview">
                <div class="stats-header">
                  <h3>
                    <i class="pi pi-chart-pie"></i>
                    Application Statistics
                  </h3>
                  <div class="stats-summary">
                    <span class="summary-text">Real-time insights into your application performance</span>
                  </div>
                </div>
                
                <div class="stats-container">
                  <div class="main-stats">
                    <div class="stat-card users primary">
                      <div class="stat-icon">
                        <i class="pi pi-users"></i>
                      </div>
                      <div class="stat-content">
                        <h4>Total Users</h4>
                        <div class="stat-number">{{ totalUsers }}</div>
                        <div class="stat-trend" :class="trends.totalUsersGrowth >= 0 ? 'positive' : 'negative'">
                          <i class="pi" :class="trends.totalUsersGrowth >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
                          {{ trends.totalUsersGrowth >= 0 ? '+' : '' }}{{ trends.totalUsersGrowth }}% from last month
                        </div>
                      </div>
                    </div>

                    <div class="stat-card active success">
                      <div class="stat-icon">
                        <i class="pi pi-bolt"></i>
                      </div>
                      <div class="stat-content">
                        <h4>Active This Week</h4>
                        <div class="stat-number">{{ activeThisWeek }}</div>
                        <div class="stat-trend" :class="trends.activeUsersGrowth >= 0 ? 'positive' : 'negative'">
                          <i class="pi" :class="trends.activeUsersGrowth >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
                          Activity {{ trends.activeUsersGrowth >= 0 ? 'up' : 'down' }} {{ Math.abs(trends.activeUsersGrowth) }}%
                        </div>
                      </div>
                    </div>

                    <div class="stat-card new-users info">
                      <div class="stat-icon">
                        <i class="pi pi-user-plus"></i>
                      </div>
                      <div class="stat-content">
                        <h4>New This Month</h4>
                        <div class="stat-number">{{ newThisMonth }}</div>
                        <div class="stat-trend positive">
                          <i class="pi pi-percentage"></i>
                          {{ trends.newUsersGrowth }}% of total users
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Additional Analytics -->
                  <div class="secondary-stats">
                    <div class="health-insights">
                      <h4>
                        <i class="pi pi-users"></i>
                        Family History Statistics
                      </h4>
                      <div class="metrics-grid">
                        <div class="metric-item health">
                          <span class="metric-label">No Family History</span>
                          <span class="metric-value">{{ familyHistoryStats.noHistory }}%</span>
                        </div>
                        <div class="metric-item health">
                          <span class="metric-label">Family History Known</span>
                          <span class="metric-value">{{ familyHistoryStats.knownHistory }}%</span>
                        </div>
                        <div class="metric-item health">
                          <span class="metric-label">Family History Unknown</span>
                          <span class="metric-value">{{ familyHistoryStats.unknownHistory }}%</span>
                        </div>
                        <div class="metric-item health">
                          <span class="metric-label">High Risk Families</span>
                          <span class="metric-value">{{ familyHistoryStats.highRisk }}%</span>
                        </div>
                      </div>
                    </div>

                    <!-- New Allergies Section -->
                    <div class="health-insights">
                      <h4>
                        <i class="pi pi-shield"></i>
                        Top Allergies
                      </h4>
                      <div class="metrics-grid">
                        <div class="metric-item health" v-for="allergy in topAllergies" :key="allergy.name">
                          <span class="metric-label">{{ allergy.name }}</span>
                          <span class="metric-value">{{ allergy.percentage }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Detailed Statistics Grid -->
                  <div class="detailed-stats">
                    <!-- First Row: Demographics, Registration Timeline, and Engagement Metrics -->
                    <div class="stats-row triple-row">
                      <div class="demographic-stats">
                        <h4>
                          <i class="pi pi-users"></i>
                          Demographics
                        </h4>
                        <div v-if="Object.values(ageGroups).reduce((a, b) => a + b, 0) > 0" class="demo-grid">
                          <div class="demo-item">
                            <div class="demo-chart">
                              <div class="chart-bar" :class="{ 'zero-bar': getAgeGroupPercentage('25-35') === 0 }" :style="{ height: getAgeGroupBarHeight('25-35') }"></div>
                              <span class="chart-label">25-35</span>
                            </div>
                            <span class="demo-percentage" :class="{ 'zero-percentage': getAgeGroupPercentage('25-35') === 0 }">{{ getAgeGroupPercentage('25-35') }}%</span>
                          </div>
                          <div class="demo-item">
                            <div class="demo-chart">
                              <div class="chart-bar" :class="{ 'zero-bar': getAgeGroupPercentage('36-45') === 0 }" :style="{ height: getAgeGroupBarHeight('36-45') }"></div>
                              <span class="chart-label">36-45</span>
                            </div>
                            <span class="demo-percentage" :class="{ 'zero-percentage': getAgeGroupPercentage('36-45') === 0 }">{{ getAgeGroupPercentage('36-45') }}%</span>
                          </div>
                          <div class="demo-item">
                            <div class="demo-chart">
                              <div class="chart-bar" :class="{ 'zero-bar': getAgeGroupPercentage('46-55') === 0 }" :style="{ height: getAgeGroupBarHeight('46-55') }"></div>
                              <span class="chart-label">46-55</span>
                            </div>
                            <span class="demo-percentage" :class="{ 'zero-percentage': getAgeGroupPercentage('46-55') === 0 }">{{ getAgeGroupPercentage('46-55') }}%</span>
                          </div>
                          <div class="demo-item">
                            <div class="demo-chart">
                              <div class="chart-bar" :class="{ 'zero-bar': getAgeGroupPercentage('55+') === 0 }" :style="{ height: getAgeGroupBarHeight('55+') }"></div>
                              <span class="chart-label">55+</span>
                            </div>
                            <span class="demo-percentage" :class="{ 'zero-percentage': getAgeGroupPercentage('55+') === 0 }">{{ getAgeGroupPercentage('55+') }}%</span>
                          </div>
                        </div>
                        <div v-else class="no-data-message">
                          <i class="pi pi-info-circle"></i>
                          <span>No age data available. Users need to complete their date of birth.</span>
                        </div>
                      </div>

                      <div class="hrt-stats">
                        <h4>
                          <i class="pi pi-heart"></i>
                          HRT Usage Statistics
                        </h4>
                        <div class="hrt-grid">
                          <div class="hrt-item">
                            <div class="hrt-info">
                              <span class="hrt-label">Currently Using HRT</span>
                              <span class="hrt-value">{{ hrtStats.currentUsers }}%</span>
                            </div>
                          </div>
                          <div class="hrt-item">
                            <div class="hrt-info">
                              <span class="hrt-label">Previously Used HRT</span>
                              <span class="hrt-value">{{ hrtStats.pastUsers }}%</span>
                            </div>
                          </div>
                          <div class="hrt-item">
                            <div class="hrt-info">
                              <span class="hrt-label">Menopause Status</span>
                              <span class="hrt-value">{{ hrtStats.menopausePercentage }}%</span>
                            </div>
                          </div>
                          <div class="hrt-item">
                            <div class="hrt-info">
                              <span class="hrt-label">Total HRT Users</span>
                              <span class="hrt-value">{{ hrtStats.totalHrtUsers }}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="addiction-stats">
                        <h4>
                          <i class="pi pi-exclamation-triangle"></i>
                          Addiction Statistics
                        </h4>
                        <div class="addiction-grid">
                          <div class="addiction-item">
                            <div :class="['addiction-circle', getAddictionColorClass(addictionStats.smoking)]">
                              <span class="addiction-percent">{{ addictionStats.smoking }}%</span>
                            </div>
                            <span class="addiction-label">Smoking</span>
                          </div>
                          <div class="addiction-item">
                            <div :class="['addiction-circle', getAddictionColorClass(addictionStats.vaping)]">
                              <span class="addiction-percent">{{ addictionStats.vaping }}%</span>
                            </div>
                            <span class="addiction-label">Vaping</span>
                          </div>
                          <div class="addiction-item">
                            <div :class="['addiction-circle', getAddictionColorClass(addictionStats.alcohol)]">
                              <span class="addiction-percent">{{ addictionStats.alcohol }}%</span>
                            </div>
                            <span class="addiction-label">Alcohol Use</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Second Row: BRCA Status Statistics (EXACT System Health Copy) -->
                    <div class="stats-row system-row">
                      <div class="system-stats full-width">
                        <h4>
                          <i class="pi pi-search"></i>
                          BRCA Status Statistics
                        </h4>
                        <div class="system-grid">
                          <div class="system-item">
                            <div class="system-indicator excellent"></div>
                            <div class="system-info">
                              <span class="system-label">No BRCA Risk</span>
                              <span class="system-value">{{ brcaStats.noRisk }}%</span>
                            </div>
                          </div>
                          <div class="system-item">
                            <div class="system-indicator good"></div>
                            <div class="system-info">
                              <span class="system-label">Total BRCA Positive</span>
                              <span class="system-value">{{ brcaStats.totalPositive }}%</span>
                            </div>
                          </div>
                          <div class="system-item">
                            <div class="system-indicator warning"></div>
                            <div class="system-info">
                              <span class="system-label">BRCA1 Positive</span>
                              <span class="system-value">{{ brcaStats.brca1 }}%</span>
                            </div>
                          </div>
                          <div class="system-item">
                            <div class="system-indicator warning"></div>
                            <div class="system-info">
                              <span class="system-label">BRCA2 Positive</span>
                              <span class="system-value">{{ brcaStats.brca2 }}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Third Row: System Health (Full Width) -->
                    <div class="stats-row system-row">
                      <div class="system-stats full-width">
                        <h4>
                          <i class="pi pi-cog"></i>
                          System Health
                        </h4>
                        <div class="system-grid">
                          <div class="system-item">
                            <div class="system-indicator online"></div>
                            <div class="system-info">
                              <span class="system-label">Server Status</span>
                              <span class="system-value">{{ systemHealth.serverStatus }}</span>
                            </div>
                          </div>
                          <div class="system-item">
                            <div class="system-indicator good"></div>
                            <div class="system-info">
                              <span class="system-label">Response Time</span>
                              <span class="system-value">{{ systemHealth.responseTime }}</span>
                            </div>
                          </div>
                          <div class="system-item">
                            <div class="system-indicator excellent"></div>
                            <div class="system-info">
                              <span class="system-label">Uptime</span>
                              <span class="system-value">{{ systemHealth.uptime }}</span>
                            </div>
                          </div>
                          <div class="system-item">
                            <div class="system-indicator" :class="systemHealth.databaseConnections > 0 ? 'excellent' : 'warning'"></div>
                            <div class="system-info">
                              <span class="system-label">DB Connections</span>
                              <span class="system-value">{{ systemHealth.databaseConnections || 0 }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Settings Tab -->
          <TabPanel>
            <template #header>
              <i class="pi pi-cog"></i>
              <span>Settings</span>
            </template>
            
            <div class="tab-content">
              <div class="settings-page">
                <h3>
                  <i class="pi pi-sliders-h"></i>
                  Application Settings
                </h3>

                <!-- Security Settings -->
                <div class="settings-section">
                  <h4>
                    <i class="pi pi-shield"></i>
                    Security & Access
                  </h4>
                  
                  <!-- Admin Management Section -->
                  <div class="admin-management-section">
                    <h5>
                      <i class="pi pi-user-plus"></i>
                      Assign/Deassign Administrator Role
                    </h5>
                    <div class="admin-form">
                      <div class="form-group">
                        <input 
                          v-model="newAdminEmail" 
                          type="email" 
                          placeholder="Enter user email address"
                          class="email-input"
                          @keypress.enter="makeUserAdmin"
                        />
                        <button 
                          @click="toggleUserAdmin"
                          class="admin-btn primary"
                          :class="{ 'remove-admin': selectedUserIsAdmin }"
                          :disabled="!newAdminEmail || isProcessing"
                        >
                          <i class="pi" :class="adminButtonIcon"></i>
                          {{ adminButtonText }}
                        </button>
                      </div>
                      <p class="form-help">
                        <i class="pi pi-info-circle"></i>
                        Only registered users can be assigned administrator role
                      </p>
                    </div>
                  </div>

                  <!-- Security Configuration Section -->
                  <div class="admin-management-section">
                    <h5>
                      <i class="pi pi-users"></i>
                      User Registration Settings
                    </h5>
                    <div class="admin-form">
                      <div class="form-group">
                        <div class="checkbox-group spacing-fix">
                          <label class="checkbox-item spaced">
                            <span class="checkbox-label">Allow new users to create accounts</span>
                            <div class="toggle-switch">
                              <input 
                                type="checkbox" 
                                v-model="settings.allowRegistration"
                                @change="updateSettings"
                              />
                              <span class="toggle-slider"></span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Password Change Section -->
                  <div class="admin-management-section">
                    <h5>
                      <i class="pi pi-key"></i>
                      Change Admin Password
                    </h5>
                    <div class="admin-form">
                      <div class="password-change-form-minimal">
                        <div class="password-inputs">
                          <input 
                            type="password" 
                            v-model="passwordChange.currentPassword"
                            placeholder="Current password"
                            class="password-input-minimal"
                            :disabled="passwordChange.isChanging"
                          />
                          <input 
                            type="password" 
                            v-model="passwordChange.newPassword"
                            placeholder="New password"
                            class="password-input-minimal"
                            :disabled="passwordChange.isChanging"
                          />
                          <input 
                            type="password" 
                            v-model="passwordChange.confirmPassword"
                            placeholder="Confirm new password"
                            class="password-input-minimal"
                            :disabled="passwordChange.isChanging"
                            @keypress.enter="changeAdminPassword"
                          />
                        </div>
                        <button 
                          @click="changeAdminPassword"
                          class="password-change-btn-minimal"
                          :disabled="!canChangePassword || passwordChange.isChanging"
                        >
                          <i class="pi" :class="passwordChange.isChanging ? 'pi-spin pi-spinner' : 'pi-key'"></i>
                          {{ passwordChange.isChanging ? 'Changing...' : 'Change Password' }}
                        </button>
                        <p class="form-help">
                          <i class="pi pi-info-circle"></i>
                          Password must be at least 6 characters long and contain at least one uppercase letter
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Privacy Settings -->
                <div class="settings-section">
                  <h4>
                    <i class="pi pi-lock"></i>
                    Privacy & Data
                  </h4>
                  
                  <!-- Privacy Management Section -->
                  <div class="admin-management-section">
                    <h5>
                      <i class="pi pi-database"></i>
                      Data Retention Management
                    </h5>
                    <div class="admin-form">
                      <div class="form-group">
                        <label>Automatically delete inactive user data after:</label>
                        <select 
                          v-model="settings.dataRetentionPeriod"
                          @change="updateSettings"
                          class="form-input"
                        >
                          <option value="365">1 Year</option>
                          <option value="730">2 Years</option>
                          <option value="1095">3 Years</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Notification Settings -->
                <div class="settings-section">
                  <h4>
                    <i class="pi pi-bell"></i>
                    Notifications
                  </h4>
                  
                  <!-- Notification Management Section -->
                  <div class="admin-management-section">
                    <h5>
                      <i class="pi pi-envelope"></i>
                      Email Notification Settings
                    </h5>
                    <div class="admin-form">
                      <div class="form-group">
                        <div class="checkbox-group spacing-fix">
                          <label class="checkbox-item spaced">
                            <span class="checkbox-label">Send system notifications via email</span>
                            <div class="toggle-switch">
                              <input 
                                type="checkbox" 
                                v-model="settings.emailNotifications"
                                @change="updateSettings"
                              />
                              <span class="toggle-slider"></span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Email Management Tab -->
          <TabPanel>
            <template #header>
              <i class="pi pi-envelope"></i>
              <span>Email Management</span>
            </template>
            
            <div class="tab-content">
              <div class="email-management-page">
                <h3>
                  <i class="pi pi-send"></i>
                  Email Communication Center
                </h3>

                <!-- Batch Email Section -->
                <div class="settings-section">
                  <h4>
                    <i class="pi pi-users"></i>
                    Send Batch Emails
                  </h4>
                  
                  <div class="admin-management-section">
                    <h5>
                      <i class="pi pi-envelope-open"></i>
                      Compose Message to Multiple Users
                    </h5>
                    <div class="batch-email-form">
                      <div class="form-group">
                        <label>Select Recipients:</label>
                        <div class="recipients-selection-modern">
                          <div class="recipients-horizontal-layout">
                            <!-- Left Side - Search and Users Grid -->
                            <div class="recipients-left-section">
                              <!-- Search Section -->
                              <div class="recipient-search">
                                <div class="search-input-wrapper">
                                  <i class="pi pi-search"></i>
                                  <input 
                                    type="text" 
                                    v-model="recipientSearch"
                                    placeholder="Search users by name or email..."
                                    class="search-input"
                                  />
                                </div>
                              </div>
                              
                              <!-- Users Grid -->
                              <div class="users-grid">
                                <div 
                                  v-for="user in filteredRecipients" 
                                  :key="user.id"
                                  class="user-card"
                                  :class="{ 'selected': isUserSelected(user) }"
                                  @click="toggleUserSelection(user)"
                                >
                                  <div class="user-avatar">
                                    <i class="pi pi-user"></i>
                                  </div>
                                  <div class="user-info">
                                    <div class="user-name">{{ getFullName(user) }}</div>
                                    <div class="user-email">{{ user.email }}</div>
                                    <div v-if="user.hasHealthData" class="user-badge health">
                                      <i class="pi pi-heart"></i>
                                      Health Data
                                    </div>
                                  </div>
                                  <div class="selection-indicator">
                                    <i class="pi pi-check"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <!-- Right Side - Actions and Summary -->
                            <div class="recipients-right-section">
                              <!-- Quick Actions -->
                              <div class="selection-actions-modern">
                                <button 
                                  @click="selectAllUsers" 
                                  class="action-btn primary"
                                  :disabled="isProcessing"
                                >
                                  <i class="pi pi-check-circle"></i>
                                  Select All ({{ filteredRecipients.length }})
                                </button>
                                
                                <button 
                                  @click="clearSelection" 
                                  class="action-btn danger"
                                  :disabled="isProcessing || selectedRecipients.length === 0"
                                >
                                  <i class="pi pi-times"></i>
                                  Clear All
                                </button>
                              </div>
                              
                              <!-- Selection Summary -->
                              <div class="selection-summary">
                                <div class="summary-info">
                                  <span class="selected-count">{{ selectedRecipients.length }}</span>
                                  <span class="summary-text">recipients</span>
                                </div>
                                
                                <div v-if="selectedRecipients.length > 0" class="selected-preview">
                                  <div class="selected-tags">
                                    <span 
                                      v-for="recipient in selectedRecipients.slice(0, 4)" 
                                      :key="recipient.id"
                                      class="selected-tag"
                                    >
                                      {{ getFullName(recipient) }}
                                      <button @click="removeUserSelection(recipient)" class="remove-tag">
                                        <i class="pi pi-times"></i>
                                      </button>
                                    </span>
                                    <span v-if="selectedRecipients.length > 4" class="more-tags">
                                      +{{ selectedRecipients.length - 4 }} more
                                    </span>
                                  </div>
                                </div>
                                
                                <div v-if="selectedRecipients.length > 50" class="warning-limit">
                                  <i class="pi pi-exclamation-triangle"></i>
                                  Max 50 recipients allowed
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label for="batch-subject">Email Subject:</label>
                        <input 
                          id="batch-subject"
                          v-model="batchEmail.subject" 
                          type="text" 
                          placeholder="Enter email subject"
                          class="form-input"
                          :disabled="isProcessing"
                        />
                      </div>

                      <div class="form-group">
                        <label for="batch-message">Email Message:</label>
                        <textarea 
                          id="batch-message"
                          v-model="batchEmail.message" 
                          placeholder="Enter your message here. You can use [USER_NAME] to personalize each email."
                          class="form-textarea"
                          rows="8"
                          :disabled="isProcessing"
                        ></textarea>
                        <p class="form-help">
                          <i class="pi pi-info-circle"></i>
                          Use <code>[USER_NAME]</code> to automatically insert each recipient's name.
                          Maximum 50 recipients per batch to ensure delivery reliability.
                        </p>
                      </div>

                      <div class="form-actions">
                        <button 
                          @click="sendBatchEmailToSelected"
                          class="batch-send-btn primary"
                          :disabled="!canSendBatchEmail || isProcessing"
                        >
                          <i class="pi" :class="isProcessing ? 'pi-spinner pi-spin' : 'pi-send'"></i>
                          {{ isProcessing ? 'Sending...' : `Send to ${selectedRecipients.length} Recipients` }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Email Templates Section -->
                <div class="settings-section">
                  <h4>
                    <i class="pi pi-file"></i>
                    Quick Email Templates
                  </h4>
                  
                  <div class="admin-management-section">
                    <div class="email-templates">
                      <div class="template-grid">
                        
                        <div class="template-card" @click="useTemplate('appointment')">
                          <div class="template-icon appointment">
                            <i class="pi pi-calendar"></i>
                          </div>
                          <h6>Appointment Reminder</h6>
                          <p>Standard appointment reminder template</p>
                        </div>

                        <div class="template-card" @click="useTemplate('newsletter')">
                          <div class="template-icon newsletter">
                            <i class="pi pi-envelope"></i>
                          </div>
                          <h6>Health Newsletter</h6>
                          <p>Monthly health tips and updates</p>
                        </div>

                        <div class="template-card" @click="useTemplate('followup')">
                          <div class="template-icon followup">
                            <i class="pi pi-heart"></i>
                          </div>
                          <h6>Follow-up Care</h6>
                          <p>Post-appointment follow-up message</p>
                        </div>

                        <div class="template-card" @click="useTemplate('wellness')">
                          <div class="template-icon wellness">
                            <i class="pi pi-shield"></i>
                          </div>
                          <h6>Wellness Check</h6>
                          <p>Periodic wellness and health check</p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </main>

    <!-- User Details Modal -->
    <div v-if="selectedUser" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="pi pi-user"></i>
            User Details
          </h3>
        </div>
        <div class="modal-body">
          <div class="user-profile">
            <div class="profile-avatar">
              <i class="pi pi-user"></i>
            </div>
            <div class="profile-info">
              <h4>{{ getFullName(selectedUser) }}</h4>
              <p>{{ selectedUser.email }}</p>
              <div class="profile-badges">
                <span v-if="selectedUser.isAdmin" class="badge admin">
                  <i class="pi pi-crown"></i>
                  Administrator
                </span>
              </div>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-section account-section">
              <h5>
                <i class="pi pi-info-circle"></i>
                Account Information
              </h5>
              <div class="detail-items">
                <div class="detail-item">
                  <span class="detail-label">Email Address</span>
                  <span class="detail-value">{{ selectedUser.userInformation?.email || selectedUser.email }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Full Name</span>
                  <span class="detail-value">{{ getFullName(selectedUser) }}</span>
                </div>
                <div v-if="selectedUser.userInformation?.maidenName" class="detail-item">
                  <span class="detail-label">Maiden Name</span>
                  <span class="detail-value">{{ getMaidenName(selectedUser) }}</span>
                </div>
                <div v-if="selectedUser.userInformation?.dob" class="detail-item">
                  <span class="detail-label">Date of Birth</span>
                  <span class="detail-value">{{ formatDate(selectedUser.userInformation.dob) }}</span>
                </div>
                <div v-if="selectedUser.userInformation?.sex" class="detail-item">
                  <span class="detail-label">Gender</span>
                  <span class="detail-value">{{ selectedUser.userInformation.sex }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Registration Date</span>
                  <span class="detail-value">{{ formatDate(selectedUser.userInformation?.registerDate || selectedUser.createdAt) }}</span>
                </div>
                <div v-if="selectedUser.userInformation?.lastUpdated" class="detail-item">
                  <span class="detail-label">Last Form Update</span>
                  <span class="detail-value">{{ formatDate(selectedUser.userInformation.lastUpdated) }}</span>
                </div>
                <div v-if="selectedUser.userInformation?.lastLoginDate" class="detail-item">
                  <span class="detail-label">Last Login</span>
                  <span class="detail-value">{{ formatDate(selectedUser.userInformation.lastLoginDate) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Account Status</span>
                  <span class="detail-value status active">Active</span>
                </div>
              </div>
            </div>

            <!-- Address Information Section -->
            <div v-if="selectedUser.addressInformation && (selectedUser.addressInformation.country || selectedUser.addressInformation.city)" class="detail-section">
              <h5 class="address-section">
                <i class="pi pi-map-marker"></i>
                Address Information
              </h5>
              <div class="detail-items">
                <div v-if="selectedUser.addressInformation.addressLine?.address1" class="detail-item">
                  <span class="detail-label">Address Line 1</span>
                  <span class="detail-value">{{ selectedUser.addressInformation.addressLine.address1 }}</span>
                </div>
                <div v-if="selectedUser.addressInformation.addressLine?.address2" class="detail-item">
                  <span class="detail-label">Address Line 2</span>
                  <span class="detail-value">{{ selectedUser.addressInformation.addressLine.address2 }}</span>
                </div>
                <div v-if="selectedUser.addressInformation.addressLine?.address3" class="detail-item">
                  <span class="detail-label">Address Line 3</span>
                  <span class="detail-value">{{ selectedUser.addressInformation.addressLine.address3 }}</span>
                </div>
                <div v-if="selectedUser.addressInformation.addressLine?.address4" class="detail-item">
                  <span class="detail-label">Address Line 4</span>
                  <span class="detail-value">{{ selectedUser.addressInformation.addressLine.address4 }}</span>
                </div>
                <div v-if="selectedUser.addressInformation.city" class="detail-item">
                  <span class="detail-label">City</span>
                  <span class="detail-value">{{ selectedUser.addressInformation.city }}</span>
                </div>
                <div v-if="selectedUser.addressInformation.country" class="detail-item">
                  <span class="detail-label">Country</span>
                  <span class="detail-value">{{ getCountryName(selectedUser.addressInformation.country) }}</span>
                </div>
              </div>
            </div>

            <!-- Health Data Details Section -->
            <div v-if="selectedUser.hasHealthData && selectedUser.healthData" class="detail-section health-data-section">
              <h5 class="health-section">
                <i class="pi pi-heart"></i>
                Health Information Details
              </h5>
              
              <!-- HRT & Menopause -->
              <div v-if="selectedUser.healthData.HRTMenopause" class="health-category">
                <h6 class="hrt-section"><i class="pi pi-venus"></i> HRT & Menopause Status</h6>
                <div class="health-items">
                  <div class="health-item primary">
                    <span class="health-label">Menopause Status:</span>
                    <span class="health-value">{{ selectedUser.healthData.HRTMenopause.menopauseStatus || 'Not specified' }}</span>
                  </div>
                  
                  <!-- Current HRT Use -->
                  <div class="health-subcategory">
                    <div class="health-item primary">
                      <span class="health-label">Currently Using HRT:</span>
                      <span class="health-value">{{ selectedUser.healthData.HRTMenopause.hrtPresent || 'Not specified' }}</span>
                    </div>
                    <div v-if="selectedUser.healthData.HRTMenopause.hrtPresentLength" class="health-item secondary">
                      <span class="health-label">Length of Current HRT Use:</span>
                      <span class="health-value">{{ selectedUser.healthData.HRTMenopause.hrtPresentLength }}</span>
                    </div>
                  </div>

                  <!-- Past HRT Use -->
                  <div class="health-subcategory">
                    <div class="health-item primary">
                      <span class="health-label">Previously Used HRT:</span>
                      <span class="health-value">{{ selectedUser.healthData.HRTMenopause.hrtPast || 'Not specified' }}</span>
                    </div>
                    <div v-if="selectedUser.healthData.HRTMenopause.hrtPastYears" class="health-item secondary">
                      <span class="health-label">Years of Past HRT Use:</span>
                      <span class="health-value">{{ selectedUser.healthData.HRTMenopause.hrtPastYears }} years</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Genetics Information -->
              <div v-if="selectedUser.healthData.genetics" class="health-category">
                <h6 class="genetics-section"><i class="pi pi-search"></i> Genetic Information</h6>
                <div class="health-items">
                  <div class="health-item">
                    <span class="health-label">BRCA Gene Status:</span>
                    <span class="health-value">{{ selectedUser.healthData.genetics.brcaKnown || 'Not specified' }}</span>
                  </div>
                  <div v-if="selectedUser.healthData.genetics.brcaGenes" class="health-item">
                    <span class="health-label">BRCA Gene Types:</span>
                    <span class="health-value">{{ Array.isArray(selectedUser.healthData.genetics.brcaGenes) ? selectedUser.healthData.genetics.brcaGenes.join(', ') : selectedUser.healthData.genetics.brcaGenes }}</span>
                  </div>
                  <div v-if="selectedUser.healthData.genetics.testDate" class="health-item">
                    <span class="health-label">Test Date:</span>
                    <span class="health-value">{{ formatDate(selectedUser.healthData.genetics.testDate) }}</span>
                  </div>
                  <div v-if="selectedUser.healthData.genetics.testProvider" class="health-item">
                    <span class="health-label">Test Provider:</span>
                    <span class="health-value">{{ selectedUser.healthData.genetics.testProvider }}</span>
                  </div>
                  <div v-if="selectedUser.healthData.genetics.geneticCounseling" class="health-item">
                    <span class="health-label">Genetic Counseling:</span>
                    <span class="health-value">{{ selectedUser.healthData.genetics.geneticCounseling }}</span>
                  </div>
                </div>
              </div>

              <!-- Family History -->
              <div v-if="selectedUser.healthData.familyHistory" class="health-category">
                <h6 class="family-section"><i class="pi pi-users"></i> Family History</h6>
                <div class="health-items">
                  <div class="health-item primary">
                    <span class="health-label">Family History Status:</span>
                    <span class="health-value">{{ selectedUser.healthData.familyHistory.familyHistoryStatus || 'Not specified' }}</span>
                  </div>
                  <div v-if="selectedUser.healthData.familyHistory.ageOfOnsetYoungestRelative" class="health-item secondary">
                    <span class="health-label">Age of Onset (Youngest Relative):</span>
                    <span class="health-value">{{ selectedUser.healthData.familyHistory.ageOfOnsetYoungestRelative }} years</span>
                  </div>
                  <div v-if="selectedUser.healthData.familyHistory.familyHistoryOptions && selectedUser.healthData.familyHistory.familyHistoryOptions.length > 0" class="health-item secondary">
                    <span class="health-label">Family History Details:</span>
                    <div class="health-value">
                      <div v-for="option in formatFamilyHistoryOptions(selectedUser.healthData.familyHistory.familyHistoryOptions)" :key="option" class="family-history-item">
                        • {{ option }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Allergies -->
              <div v-if="selectedUser.healthData.allergies" class="health-category">
                <h6 class="allergy-section"><i class="pi pi-shield"></i> Allergies</h6>
                <div class="health-items">
                  <div class="health-item primary">
                    <span class="health-label">Known Allergies:</span>
                    <span class="health-value">{{ 
                      selectedUser.healthData.allergies.allergies && Array.isArray(selectedUser.healthData.allergies.allergies) 
                        ? selectedUser.healthData.allergies.allergies.join(', ') 
                        : (selectedUser.healthData.allergies.allergies || 'No allergies reported') 
                    }}</span>
                  </div>
                  <div v-if="selectedUser.healthData.allergies.specifyDressing" class="health-item secondary">
                    <span class="health-label">Dressing Allergy Details:</span>
                    <span class="health-value">{{ selectedUser.healthData.allergies.specifyDressing }}</span>
                  </div>
                  <div v-if="selectedUser.healthData.allergies.specifyOtherAllergies" class="health-item secondary">
                    <span class="health-label">Other Allergy Details:</span>
                    <span class="health-value">{{ selectedUser.healthData.allergies.specifyOtherAllergies }}</span>
                  </div>
                </div>
              </div>

              <!-- Lifestyle Factors with Extended Details -->
              <div class="health-category addictions">
                <h6 class="lifestyle-section"><i class="pi pi-exclamation-triangle"></i> Lifestyle Factors</h6>
                <div class="health-items">
                  
                  <!-- Smoking Details -->
                  <div v-if="selectedUser.healthData.smoking" class="health-subcategory">
                    <div :class="['health-item', getAddictionColorClass(selectedUser.healthData.smoking.smokingStatus)]">
                      <span class="health-label">Smoking Status:</span>
                      <span class="health-value">{{ selectedUser.healthData.smoking.smokingStatus || 'Not specified' }}</span>
                    </div>
                    <div v-if="selectedUser.healthData.smoking.smokingYears" class="health-item secondary">
                      <span class="health-label">Years of Smoking:</span>
                      <span class="health-value">{{ selectedUser.healthData.smoking.smokingYears }} years</span>
                    </div>
                    <div v-if="selectedUser.healthData.smoking.smokedDaily" class="health-item secondary">
                      <span class="health-label">Daily Smoking Amount:</span>
                      <span class="health-value">{{ selectedUser.healthData.smoking.smokedDaily }} cigarettes per day</span>
                    </div>
                    <div v-if="selectedUser.healthData.smoking.yearsStoppedSmoking" class="health-item secondary">
                      <span class="health-label">Years Since Stopped:</span>
                      <span class="health-value">{{ selectedUser.healthData.smoking.yearsStoppedSmoking }} years</span>
                    </div>
                  </div>

                  <!-- Vaping Details -->
                  <div v-if="selectedUser.healthData.vaping" class="health-subcategory">
                    <div :class="['health-item', getAddictionColorClass(selectedUser.healthData.vaping.vapingStatus)]">
                      <span class="health-label">Vaping Status:</span>
                      <span class="health-value">{{ selectedUser.healthData.vaping.vapingStatus || 'Not specified' }}</span>
                    </div>
                    <div v-if="selectedUser.healthData.vaping.vapingYears" class="health-item secondary">
                      <span class="health-label">Years of Vaping:</span>
                      <span class="health-value">{{ selectedUser.healthData.vaping.vapingYears }} years</span>
                    </div>
                    <div v-if="selectedUser.healthData.vaping.vapingPodsPerWeek" class="health-item secondary">
                      <span class="health-label">Vaping Pods per Week:</span>
                      <span class="health-value">{{ selectedUser.healthData.vaping.vapingPodsPerWeek }} pods</span>
                    </div>
                    <div v-if="selectedUser.healthData.vaping.nicotineStrength" class="health-item secondary">
                      <span class="health-label">Nicotine Strength:</span>
                      <span class="health-value">{{ selectedUser.healthData.vaping.nicotineStrength }} mg</span>
                    </div>
                    <div v-if="selectedUser.healthData.vaping.yearsStoppedVaping" class="health-item secondary">
                      <span class="health-label">Years Since Stopped:</span>
                      <span class="health-value">{{ selectedUser.healthData.vaping.yearsStoppedVaping }} years</span>
                    </div>
                  </div>

                  <!-- Alcohol Details -->
                  <div v-if="selectedUser.healthData.alcohol" class="health-subcategory">
                    <div :class="['health-item', getAddictionColorClass(selectedUser.healthData.alcohol.alcoholStatus)]">
                      <span class="health-label">Alcohol Usage:</span>
                      <span class="health-value">{{ selectedUser.healthData.alcohol.alcoholStatus || 'Not specified' }}</span>
                    </div>
                    <div v-if="selectedUser.healthData.alcohol.drinkingYears" class="health-item secondary">
                      <span class="health-label">Years of Drinking:</span>
                      <span class="health-value">{{ selectedUser.healthData.alcohol.drinkingYears }} years</span>
                    </div>
                    <div v-if="selectedUser.healthData.alcohol.standardDrinksPerWeek" class="health-item secondary">
                      <span class="health-label">Standard Drinks per Week:</span>
                      <span class="health-value">{{ selectedUser.healthData.alcohol.standardDrinksPerWeek }} drinks</span>
                    </div>
                    <div v-if="selectedUser.healthData.alcohol.bingeDrinksPerMonth" class="health-item secondary">
                      <span class="health-label">Binge Drinks per Month:</span>
                      <span class="health-value">{{ selectedUser.healthData.alcohol.bingeDrinksPerMonth }} sessions</span>
                    </div>
                    <div v-if="selectedUser.healthData.alcohol.yearsStoppedDrinking" class="health-item secondary">
                      <span class="health-label">Years Since Stopped:</span>
                      <span class="health-value">{{ selectedUser.healthData.alcohol.yearsStoppedDrinking }} years</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- No Health Data Section -->
            <div v-else class="detail-section">
              <h5>
                <i class="pi pi-chart-bar"></i>
                Health Data Status
              </h5>
              <div class="health-status">
                <div class="status-card pending">
                  <i class="pi pi-clock"></i>
                  <div>
                    <h6>Form Pending</h6>
                    <p>User has not yet submitted health information</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <!-- Modal Footer with Admin Actions -->
        <div class="modal-footer">
          <div class="modal-footer-left">
            <button 
              @click="sendAppointmentEmail"
              class="send-mail-btn"
              :disabled="isProcessing || !selectedUser?.userInformation?.email"
              title="Send appointment reminder email"
            >
              <i class="pi pi-envelope"></i>
              Send Mail
            </button>
          </div>
          
          <div class="modal-footer-right">
            <button 
              @click="toggleSelectedUserAdmin"
              class="admin-action-btn"
              :class="{ 'remove-admin': selectedUser.isAdmin, 'make-admin': !selectedUser.isAdmin }"
              :disabled="isProcessing"
            >
              <i class="pi" :class="selectedUser.isAdmin ? 'pi-user-minus' : 'pi-crown'"></i>
              {{ selectedUser.isAdmin ? 'Remove Admin' : 'Make Admin' }}
            </button>
            
            <button @click="closeModal" class="close-modal-btn secondary">
              <i class="pi pi-times"></i>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Messages -->
    <Toast />
  </div>
</template>

<style scoped>
@import '../style/AdminView.css';
</style>

<script>
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { AdminManager } from "../utils/AdminManager";
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toast from 'primevue/toast';

export default {
  name: 'AdminView',
  components: {
    TabView,
    TabPanel,
    Toast
  },
  data() {
    return {
      activeTab: 0,
      currentUserEmail: '',
      users: [],
      userSearch: '',
      filteredUsersList: [],
      selectedUser: null,
      totalUsers: 0,
      adminCount: 0,
      completedForms: 0,
      activeThisWeek: 0,
      newThisMonth: 0,
      loading: false,
      isProcessing: false,
      newAdminEmail: '',
      // Real data objects
      ageGroups: { '25-35': 0, '36-45': 0, '46-55': 0, '55+': 0 },
      hrtStats: { currentUsers: 0, pastUsers: 0, menopausePercentage: 0, totalHrtUsers: 0 },
      addictionStats: { smoking: 0, vaping: 0, alcohol: 0 },
      brcaStats: { noRisk: 0, totalPositive: 0, brca1: 0, brca2: 0 },
      familyHistoryStats: { noHistory: 0, knownHistory: 0, unknownHistory: 0, highRisk: 0 },
      topAllergies: [],
      registrationTimeline: { thisWeek: 0, thisMonth: 0, last3Months: 0, lastYear: 0 },
      healthMetrics: { regularCheckups: 0, riskAssessments: 0, followupNeeded: 0, highPriority: 0 },
      activityPatterns: { morningActive: 0, eveningActive: 0, weekendUsers: 0, dailyAverage: 0 },
      engagementMetrics: { dataCompletion: 0, monthlyReturn: 0, featureUsage: 0 },
      systemHealth: { serverStatus: 'Loading...', responseTime: '...', uptime: '...', storageUsed: '...' },
      // Trend calculations
      trends: { 
        totalUsersGrowth: 0, 
        activeUsersGrowth: 0, 
        newUsersGrowth: 0,
        lastMonthUsers: 0,
        lastWeekActiveUsers: 0 
      },
      settings: {
        allowRegistration: true,
        dataRetentionPeriod: '730',
        emailNotifications: true
      },
      // Password Change
      passwordChange: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        isChanging: false
      },
      // Batch Email Management
      selectedRecipients: [],
      recipientSearch: '',
      batchEmail: {
        subject: '',
        message: ''
      },
      emailLogs: [],
      emailTemplates: {
        appointment: {
          subject: 'Important: Appointment Reminder - Health Tracker',
          message: `Hello [USER_NAME],

We hope this email finds you in good health.

This is a friendly reminder regarding your healthcare appointment. Please contact us at your earliest convenience to schedule or confirm your appointment.

Our healthcare team is ready to assist you with:
• Health assessment and consultation
• Medical examination scheduling  
• Follow-up care coordination
• Any questions or concerns you may have

Please reach out to us by:
📞 Phone: [Your clinic phone number]
📧 Email: [Your clinic email]
🏥 Visit: [Your clinic address]

Thank you for prioritizing your health. We look forward to hearing from you soon.

Best regards,
Healthcare Team
Breast Cancer Tracker System`
        },
        newsletter: {
          subject: 'Monthly Health Newsletter - Important Updates',
          message: `Dear [USER_NAME],

We hope you are staying healthy and well!

This month's newsletter includes:
• Latest health screening recommendations
• Upcoming health awareness events
• New features in our health tracking system
• Community health tips and resources

Key Reminders:
✅ Schedule your regular health checkups
✅ Keep your health information updated
✅ Review your family health history
✅ Stay active and maintain a healthy lifestyle

If you have any questions or need to update your information, please don't hesitate to contact us.

Stay healthy!
Healthcare Team
Breast Cancer Tracker System`
        },
        followup: {
          subject: 'Follow-up: Your Recent Health Visit',
          message: `Hello [USER_NAME],

Thank you for your recent visit with our healthcare team.

This follow-up message is to:
• Ensure you received all necessary information
• Answer any additional questions you might have
• Remind you of next steps in your care plan
• Provide resources for your continued health journey

Important Next Steps:
📋 Review any provided materials or instructions
💊 Follow prescribed treatments or recommendations  
📅 Schedule any recommended follow-up appointments
📞 Contact us if you have questions or concerns

Your health is our priority. Please reach out if you need any support or have questions about your care plan.

Best regards,
Healthcare Team
Breast Cancer Tracker System`
        },
        wellness: {
          subject: 'Wellness Check-in - How Are You Feeling?',
          message: `Hello [USER_NAME],

We're checking in to see how you're doing!

Regular wellness check-ins help us:
• Monitor your overall health and wellbeing
• Identify any new health concerns early
• Ensure you're getting the care you need
• Support your health goals and lifestyle

Please consider:
🏃‍♀️ Are you staying physically active?
🥗 Are you maintaining a healthy diet?
😴 Are you getting enough quality sleep?
🧘‍♀️ Are you managing stress effectively?
💊 Are you keeping up with medications/treatments?

If you have any health concerns or would like to schedule a check-up, please don't hesitate to contact us.

We're here to support your health journey every step of the way.

Warm regards,
Healthcare Team
Breast Cancer Tracker System`
        }
      }
    };
  },
  
  computed: {
    // Check if the entered email is already an admin
    selectedUserIsAdmin() {
      if (!this.newAdminEmail || !this.newAdminEmail.trim()) return false;
      const email = this.newAdminEmail.trim().toLowerCase();
      const user = this.users.find(u => u.email.toLowerCase() === email);
      return user ? user.isAdmin : false;
    },
    
    // Dynamic button text and action
    adminButtonText() {
      if (this.isProcessing) return 'Processing...';
      return this.selectedUserIsAdmin ? 'Remove Admin' : 'Make Admin';
    },
    
    // Dynamic button icon
    adminButtonIcon() {
      return this.selectedUserIsAdmin ? 'pi-user-minus' : 'pi-crown';
    },

    // Batch Email Computed Properties
    usersWithHealthData() {
      return this.users.filter(user => user.hasHealthData);
    },

    newUsersList() {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return this.users.filter(user => {
        const registerDate = user.userInformation?.registerDate || user.createdAt;
        if (!registerDate) return false;
        
        const userDate = new Date(registerDate);
        return userDate >= thirtyDaysAgo;
      });
    },

    canSendBatchEmail() {
      return this.selectedRecipients.length > 0 && 
             this.selectedRecipients.length <= 50 && 
             this.batchEmail.subject.trim() && 
             this.batchEmail.message.trim() && 
             !this.isProcessing;
    },

    canChangePassword() {
      return this.passwordChange.currentPassword.trim() && 
             this.passwordChange.newPassword.trim() && 
             this.passwordChange.confirmPassword.trim() && 
             this.passwordChange.newPassword === this.passwordChange.confirmPassword &&
             this.passwordChange.newPassword.length >= 6 &&
             /[A-Z]/.test(this.passwordChange.newPassword) &&
             !this.passwordChange.isChanging;
    },

    // New computed properties for recipient selection
    filteredRecipients() {
      if (!this.recipientSearch) return this.users;
      
      const search = this.recipientSearch.toLowerCase();
      return this.users.filter(user => {
        const fullName = this.getFullName(user).toLowerCase();
        const email = user.email.toLowerCase();
        return fullName.includes(search) || email.includes(search);
      });
    },

    healthUsersCount() {
      return this.filteredRecipients.filter(user => user.hasHealthData).length;
    }
  },

  watch: {
    userSearch: {
      handler(newVal) {
        this.updateFilteredUsers();
      },
      immediate: true
    },
    users: {
      handler() {
        this.updateFilteredUsers();
      },
      immediate: true
    }
  },
  
  async mounted() {
    await this.verifyAdminAccess();
    this.currentUserEmail = auth.currentUser?.email || '';
    await this.loadUsers();
    await this.loadStatistics();
    await this.loadSettings();
  },
  
  methods: {
    // Lifestyle status'a göre renk class'ı döndürür
    getAddictionColorClass(status) {
      if (!status) return 'primary';
      const s = status.toLowerCase();
      if (s.includes('smoking') || s.includes('regular use')) return 'warning';
      if (s.includes('vaping')) return 'average';
      if (s.includes('never') || s.includes('none')) return 'excellent';
      return 'good';
    },
    // Addiction oranına göre renk class'ı döndürür
    getAddictionColorClass(percent) {
      if (percent < 20) return 'excellent';
      if (percent < 40) return 'good';
      if (percent < 60) return 'average';
      return 'warning';
    },
    // Update filtered users list
    updateFilteredUsers() {
      if (!this.userSearch || this.userSearch.trim() === '') {
        this.filteredUsersList = [...this.users];
        return;
      }
      
      const searchQuery = this.userSearch.toLowerCase().trim()
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .replace(/ı/g, 'i');
        
      this.filteredUsersList = this.users.filter(user => {
        const fullName = this.getFullName(user).toLowerCase()
          .replace(/ş/g, 's')
          .replace(/ç/g, 'c')
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ö/g, 'o')
          .replace(/ı/g, 'i');
        const email = user.email ? user.email.toLowerCase() : '';
        return fullName.includes(searchQuery) || email.includes(searchQuery);
      });
      
      console.log(`Filtered users updated: ${this.filteredUsersList.length} results for "${this.userSearch}"`);
    },

    // Filter users based on search query
    getFilteredUsers() {
      if (!this.userSearch || this.userSearch.trim() === '') {
        return this.users;
      }
      
      const searchQuery = this.userSearch.toLowerCase().trim()
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .replace(/ı/g, 'i');
        
      return this.users.filter(user => {
        const fullName = this.getFullName(user).toLowerCase()
          .replace(/ş/g, 's')
          .replace(/ç/g, 'c')
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ö/g, 'o')
          .replace(/ı/g, 'i');
        const email = user.email ? user.email.toLowerCase() : '';
        return fullName.includes(searchQuery) || email.includes(searchQuery);
      });
    },

    async verifyAdminAccess() {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User authentication not found');
        }
        
        // Use AdminManager for free admin check
        const isAdmin = await AdminManager.isUserAdmin(user.email);
        
        if (!isAdmin) {
          console.warn(`Unauthorized admin panel access: ${user.email}`);
          alert('You do not have permission to access this page!');
          this.$router.push('/home');
          return;
        }
        
        // Initialize admin status if user is in initial admins list
        await AdminManager.initializeAdminStatus();
      } catch (error) {
        console.error('Admin verification error:', error);
        alert('Authorization verification failed!');
        this.$router.push('/');
      }
    },

    async loadUsers() {
      this.loading = true;
      try {
        // Use AdminManager for free user listing
        const result = await AdminManager.getAllUsers();
        
        console.log('✅ AdminManager result:', result);
        
        // Map AdminManager data to AdminView format
        this.users = (result.users || []).map(user => ({
          ...user,
          surname: user.lastName || user.surname || '', // Don't use 'Unknown', let getFullName handle it
          hasHealthData: user.hasHealthInfo || false, // Map hasHealthInfo to hasHealthData
          formCompletion: user.formCompletionStatus || {}
        }));
        
        this.totalUsers = this.users.length;
        this.adminCount = this.users.filter(user => user.isAdmin).length;
        
      } catch (error) {
        console.error("Error loading user list:", error);
        alert('Failed to load user list: ' + error.message);
      } finally {
        this.loading = false;
      }
    },

    async loadStatistics() {
      try {
        // Get real statistics from Firebase users
        const querySnapshot = await getDocs(collection(db, "users"));
        
        let totalUsers = 0;
        let activeThisWeek = 0;
        let completedForms = 0;
        let newThisMonth = 0;
        let lastMonthUsers = 0;
        let lastWeekActiveUsers = 0;
        let ageGroups = { '25-35': 0, '36-45': 0, '46-55': 0, '55+': 0 };
        let registrationTimeline = { thisWeek: 0, thisMonth: 0, last3Months: 0, lastYear: 0 };
        
        // New health statistics counters
        let hrtStats = { currentUsers: 0, pastUsers: 0, menopauseUsers: 0, totalWithData: 0 };
        let addictionStats = { smoking: 0, vaping: 0, alcohol: 0, totalWithData: 0 };
        let brcaStats = { noRisk: 0, brca1: 0, brca2: 0, totalWithData: 0 };
        let familyHistoryStats = { noHistory: 0, knownHistory: 0, unknownHistory: 0, totalWithData: 0 };
        let allergyCount = {};
        
        const now = new Date();
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        const twoMonthsAgo = new Date(now - 60 * 24 * 60 * 60 * 1000);
        const threeMonthsAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);
        const oneYearAgo = new Date(now - 365 * 24 * 60 * 60 * 1000);
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          totalUsers++;
          
          // Check if user has health data - look in healthInformation
          if (userData.hasHealthData || userData.healthInformation) {
            completedForms++;
          }
          
          // Calculate age group from dob (date of birth)
          if (userData.userInformation && userData.userInformation.dob) {
            const birthDate = new Date(userData.userInformation.dob);
            
            // Validate birthDate
            if (!isNaN(birthDate.getTime())) {
              const age = now.getFullYear() - birthDate.getFullYear();
              const monthDiff = now.getMonth() - birthDate.getMonth();
              const realAge = monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate()) ? age - 1 : age;
              
              if (realAge >= 25 && realAge <= 35) ageGroups['25-35']++;
              else if (realAge >= 36 && realAge <= 45) ageGroups['36-45']++;
              else if (realAge >= 46 && realAge <= 55) ageGroups['46-55']++;
              else if (realAge > 55) ageGroups['55+']++;
            }
          }
          
          // Registration timeline from userInformation.registerDate
          const createdAt = userData.userInformation && userData.userInformation.registerDate ? 
            new Date(userData.userInformation.registerDate) : 
            (userData.createdAt ? new Date(userData.createdAt) : new Date());
            
          if (createdAt >= oneWeekAgo) {
            registrationTimeline.thisWeek++;
          }
          if (createdAt >= oneMonthAgo) {
            registrationTimeline.thisMonth++;
            newThisMonth++; // Anyone registered in last 30 days is "new this month"
          }
          if (createdAt >= twoMonthsAgo) {
            lastMonthUsers++;
          }
          if (createdAt >= threeMonthsAgo) {
            registrationTimeline.last3Months++;
          }
          if (createdAt >= oneYearAgo) {
            registrationTimeline.lastYear++;
          }
          
          // NEW HEALTH STATISTICS CALCULATIONS
          if (userData.healthInformation) {
            activeThisWeek++;
            
            // HRT Statistics
            const hrtData = userData.healthInformation.HRTMenopause;
            if (hrtData) {
              hrtStats.totalWithData++;
              if (hrtData.hrtPresent === 'Yes') hrtStats.currentUsers++;
              if (hrtData.hrtPast === 'Yes') hrtStats.pastUsers++;
              if (hrtData.menopauseStatus === 'Yes') hrtStats.menopauseUsers++;
            }
            
            // Addiction Statistics
            const smokingData = userData.healthInformation.smoking;
            const vapingData = userData.healthInformation.vaping;
            const alcoholData = userData.healthInformation.alcohol;
            
            if (smokingData || vapingData || alcoholData) {
              addictionStats.totalWithData++;
              if (smokingData && smokingData.smokingStatus === 'Smoking') addictionStats.smoking++;
              if (vapingData && vapingData.vapingStatus === 'Vaping') addictionStats.vaping++;
              if (alcoholData && alcoholData.alcoholStatus === 'Regular Use') addictionStats.alcohol++;
            }
            
            // BRCA Statistics
            const geneticsData = userData.healthInformation.genetics;
            if (geneticsData) {
              brcaStats.totalWithData++;
              if (geneticsData.brcaKnown === 'no') {
                brcaStats.noRisk++;
              } else if (geneticsData.brcaKnown === 'yes' && geneticsData.brcaGenes) {
                if (geneticsData.brcaGenes.includes('BRCA1')) brcaStats.brca1++;
                if (geneticsData.brcaGenes.includes('BRCA2')) brcaStats.brca2++;
              }
            }
            
            // Family History Statistics
            const familyHistoryData = userData.healthInformation.familyHistory;
            if (familyHistoryData) {
              familyHistoryStats.totalWithData++;
              if (familyHistoryData.familyHistoryStatus === 'No Family History') {
                familyHistoryStats.noHistory++;
              } else if (familyHistoryData.familyHistoryStatus === 'Family History Known') {
                familyHistoryStats.knownHistory++;
              } else {
                familyHistoryStats.unknownHistory++;
              }
            }
            
            // Allergies Statistics
            const allergiesData = userData.healthInformation.allergies;
            if (allergiesData && allergiesData.allergies && Array.isArray(allergiesData.allergies)) {
              allergiesData.allergies.forEach(allergy => {
                if (allergy && allergy !== 'No Allergies') {
                  allergyCount[allergy] = (allergyCount[allergy] || 0) + 1;
                }
              });
            }
          }
        });
        
        // Calculate percentages for new statistics
        const calculatePercentage = (count, total) => total > 0 ? Math.round((count / total) * 100) : 0;
        
        // HRT Statistics (percentage of ALL users)
        this.hrtStats = {
          currentUsers: calculatePercentage(hrtStats.currentUsers, totalUsers),
          pastUsers: calculatePercentage(hrtStats.pastUsers, totalUsers),
          menopausePercentage: calculatePercentage(hrtStats.menopauseUsers, totalUsers),
          totalHrtUsers: calculatePercentage(hrtStats.currentUsers + hrtStats.pastUsers, totalUsers)
        };
        
        // Addiction Statistics (percentage of users with addiction data)
        this.addictionStats = {
          smoking: calculatePercentage(addictionStats.smoking, addictionStats.totalWithData),
          vaping: calculatePercentage(addictionStats.vaping, addictionStats.totalWithData),
          alcohol: calculatePercentage(addictionStats.alcohol, addictionStats.totalWithData)
        };
        
        // BRCA Statistics (percentage of users with genetics data)
        this.brcaStats = {
          noRisk: calculatePercentage(brcaStats.noRisk, brcaStats.totalWithData),
          totalPositive: calculatePercentage(brcaStats.brca1 + brcaStats.brca2, brcaStats.totalWithData),
          brca1: calculatePercentage(brcaStats.brca1, brcaStats.totalWithData),
          brca2: calculatePercentage(brcaStats.brca2, brcaStats.totalWithData)
        };
        
        // Family History Statistics
        this.familyHistoryStats = {
          noHistory: calculatePercentage(familyHistoryStats.noHistory, familyHistoryStats.totalWithData),
          knownHistory: calculatePercentage(familyHistoryStats.knownHistory, familyHistoryStats.totalWithData),
          unknownHistory: calculatePercentage(familyHistoryStats.unknownHistory, familyHistoryStats.totalWithData),
          highRisk: calculatePercentage(familyHistoryStats.knownHistory, familyHistoryStats.totalWithData) // Known history considered high risk
        };
        
        // Top 4 Allergies
        const sortedAllergies = Object.entries(allergyCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 4)
          .map(([name, count]) => ({
            name,
            percentage: calculatePercentage(count, totalUsers)
          }));
        
        // Fill with default values if not enough allergies
        while (sortedAllergies.length < 4) {
          sortedAllergies.push({ name: 'No Data', percentage: 0 });
        }
        
        this.topAllergies = sortedAllergies;
        
        // Store existing calculated values
        this.totalUsers = totalUsers;
        this.activeThisWeek = activeThisWeek;
        this.completedForms = completedForms;
        this.newThisMonth = newThisMonth;
        this.ageGroups = ageGroups;
        this.registrationTimeline = registrationTimeline;
        
        // Calculate trends (100% real data only)
        const totalUsersGrowth = lastMonthUsers > 0 ? 
          Math.round(((totalUsers - lastMonthUsers) / lastMonthUsers) * 100) : 0;
          
        const activeUsersGrowth = lastWeekActiveUsers > 0 ? 
          Math.round(((activeThisWeek - lastWeekActiveUsers) / lastWeekActiveUsers) * 100) : 0;
          
        const newUsersGrowth = totalUsers > 0 ? Math.round((newThisMonth / totalUsers) * 100) : 0;
        
        this.trends = {
          totalUsersGrowth,
          activeUsersGrowth,
          newUsersGrowth,
          lastMonthUsers,
          lastWeekActiveUsers
        };
        
        // Debug logs for new statistics
        
        // System health metrics
        await this.loadSystemHealth();
        
      } catch (error) {
        console.error("Statistics loading error:", error);
        // Use real data if available, otherwise set to 0
        this.activeThisWeek = this.users.filter(user => user.hasHealthData).length || 0;
        this.completedForms = this.users.filter(user => user.hasHealthData && user.hasUserInfo).length || 0;
      }
    },

    async loadSystemHealth() {
      try {
        // Real Firebase connection check
        const startTime = performance.now();
        
        // Test Firebase connection with a simple query
        await getDocs(collection(db, "users")).then(() => {
          const endTime = performance.now();
          const responseTime = Math.round(endTime - startTime);
          
          this.systemHealth = {
            serverStatus: 'Online',
            responseTime: `${responseTime}ms`,
            uptime: '99.9%', // Static value - real uptime monitoring would require external service
            databaseConnections: 1 // Current active connection
          };
        });
        
      } catch (error) {
        console.error("System health check failed:", error);
        this.systemHealth = {
          serverStatus: 'Connection Issues',
          responseTime: 'Timeout',
          uptime: 'Checking...',
          databaseConnections: 0
        };
      }
    },

    calculateProfileCompleteness(userData) {
      let score = 0;
      let totalFields = 0;
      
      // User Information fields (30 points)
      if (userData.userInformation) {
        const userInfo = userData.userInformation;
        if (userInfo.firstName) score += 5;
        if (userInfo.surname) score += 5;
        if (userInfo.dob) score += 10;
        if (userInfo.sex) score += 10;
        totalFields += 30;
      }
      
      // Address Information (20 points)
      if (userData.addressInformation) {
        const addressInfo = userData.addressInformation;
        if (addressInfo.city) score += 10;
        if (addressInfo.country) score += 10;
        totalFields += 20;
      }
      
      // Health Information (50 points)
      if (userData.healthInformation) {
        const healthInfo = userData.healthInformation;
        if (healthInfo.HRTMenopause) score += 10;
        if (healthInfo.genetics) score += 10;
        if (healthInfo.familyHistory) score += 15;
        if (healthInfo.allergies) score += 5;
        if (healthInfo.smoking) score += 5;
        if (healthInfo.vaping) score += 2.5;
        if (healthInfo.alcohol) score += 2.5;
        totalFields += 50;
      }
      
      return totalFields > 0 ? Math.round((score / totalFields) * 100) : 0;
    },

    getAgeGroupPercentage(ageGroup) {
      const totalUsersWithDOB = Object.values(this.ageGroups).reduce((a, b) => a + b, 0);
      if (totalUsersWithDOB === 0) return 0;
      return Math.round((this.ageGroups[ageGroup] / totalUsersWithDOB) * 100);
    },

    getAgeGroupBarHeight(ageGroup) {
      const totalUsersWithDOB = Object.values(this.ageGroups).reduce((a, b) => a + b, 0);
      if (totalUsersWithDOB === 0) return '10px';
      
      const percentage = (this.ageGroups[ageGroup] / totalUsersWithDOB) * 100;
      
      // Direct percentage to height conversion for consistency
      // 0% = 10px (minimum visible), 100% = 100%
      if (percentage === 0) return '10px';
      
      // Map percentage to visual height (10% to 90% range)
      const visualHeight = (percentage / 100) * 80 + 10;
      return visualHeight + '%';
    },

    async toggleUserAdmin() {
      console.log('🎯 Toggle admin called with email:', this.newAdminEmail);
      
      if (!this.newAdminEmail || !this.newAdminEmail.trim()) {
        alert('Please enter a valid email address!');
        return;
      }

      const email = this.newAdminEmail.trim().toLowerCase();
      
      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email format!');
        return;
      }

      const user = this.users.find(u => u.email.toLowerCase() === email);
      console.log('👤 Found user:', user);
      
      if (!user) {
        alert('Bu email adresiyle kayıtlı kullanıcı bulunamadı! Kullanıcının önce sisteme kayıt olması gerekiyor.');
        return;
      }

      // Determine action based on current status
      const isAdmin = user.isAdmin;
      console.log('👑 User is currently admin:', isAdmin);
      
      const action = isAdmin ? 'remove admin rights from' : 'make admin';
      const actionText = isAdmin ? 'admin yetkisini kaldırmak' : 'admin yapmak';
      
      // Confirmation dialog
      const confirmed = confirm(
        `${email} kullanıcısını ${actionText} istediğinizden emin misiniz?\n\n` +
        `⚠️ Bu işlem geri alınamaz!\n` +
        `${isAdmin ? '👤 Kullanıcı admin yetkilerini kaybedecek.' : '👑 Kullanıcı tüm admin yetkilerine sahip olacak.'}`
      );
      
      console.log('❓ User confirmed action:', confirmed);
      
      if (!confirmed) return;

      if (isAdmin) {
        console.log('🗑️ Calling admin removal...');
        await this.processAdminRemoval(email);
      } else {
        console.log('👑 Calling admin creation...');
        await this.processAdminCreation(email);
      }
    },

    async makeUserAdmin() {
      // Keep this method for backward compatibility with modal
      await this.toggleUserAdmin();
    },

    async quickMakeAdmin(userEmail) {
      const confirmed = confirm(
        `${userEmail} kullanıcısını admin yapmak istediğinizden emin misiniz?\n\n` +
        `⚠️ Bu işlem geri alınamaz!`
      );
      
      if (!confirmed) return;

      await this.processAdminCreation(userEmail);
    },

    async processAdminCreation(userEmail) {
      this.isProcessing = true;
      console.log('🔄 Starting admin creation process for:', userEmail);
      
      try {
        // SECURITY: Fresh admin check before any admin operation
        const currentUserEmail = this.$store?.state?.auth?.user?.email || auth.currentUser?.email;
        const isStillAdmin = await AdminManager.isUserAdmin(currentUserEmail);
        
        if (!isStillAdmin) {
          alert('❌ Yetkiniz kaldırıldı! Admin işlemi yapma yetkiniz yok.');
          this.$router.push('/');
          return;
        }
        
        console.log('✅ Fresh admin check passed for:', currentUserEmail);
        
        // Check if user exists
        const userExists = this.users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
        console.log('👤 User found:', userExists);
        
        if (!userExists) {
          throw new Error('Bu email adresiyle kayıtlı kullanıcı bulunamadı! Kullanıcının önce sisteme kayıt olması gerekiyor.');
        }

        if (userExists.isAdmin) {
          throw new Error('Bu kullanıcı zaten admin!');
        }

        console.log('✅ User validation passed, calling AdminManager...');

        // Use AdminManager for free admin creation
        const result = await AdminManager.setAdminRole(userEmail.toLowerCase(), true);
        
        console.log('✅ AdminManager result:', result);
        
        alert(`✅ ${userEmail} was successfully made admin!\n\n🔄 The user needs to refresh the page to see admin privileges.`);
        
        // Clear form and refresh list
        this.newAdminEmail = '';
        await this.loadUsers();
        
      } catch (error) {
        console.error("❌ Error making admin:", error);
        alert('❌ Failed to make admin:\n\n' + error.message);
      } finally {
        this.isProcessing = false;
        console.log('🔄 Admin creation process finished');
      }
    },

    async processAdminRemoval(userEmail) {
      this.isProcessing = true;
      
      try {
        // SECURITY: Fresh admin check before any admin operation
        const currentUserEmail = this.$store?.state?.auth?.user?.email || auth.currentUser?.email;
        const isStillAdmin = await AdminManager.isUserAdmin(currentUserEmail);
        
        if (!isStillAdmin) {
          alert('❌ Yetkiniz kaldırıldı! Admin işlemi yapma yetkiniz yok.');
          this.$router.push('/');
          return;
        }
        
        console.log('✅ Fresh admin check passed for:', currentUserEmail);
        // Check if user exists and is admin
        const userExists = this.users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
        if (!userExists) {
          throw new Error('Bu email adresiyle kayıtlı kullanıcı bulunamadı!');
        }

        if (!userExists.isAdmin) {
          throw new Error('Bu kullanıcı zaten admin değil!');
        }

        // Check if trying to remove a hardcoded admin
        const hardcodedAdmins = ['i.canoztozlu@gmail.com']; // Copy hardcoded list
        if (hardcodedAdmins.includes(userEmail.toLowerCase())) {
          throw new Error('Bu kullanıcı sistem yöneticisi! Yetkisi kaldırılamaz.');
        }

        // Get fresh admin count from database to ensure accuracy
        const result = await AdminManager.getAllUsers();
        const currentAdmins = result.users.filter(u => u.isAdmin);
        
        // Count removable admins (exclude hardcoded ones)
        const removableAdmins = currentAdmins.filter(u => 
          !hardcodedAdmins.includes(u.email.toLowerCase())
        );
        
        // Also count hardcoded admins that exist in the system (even if not marked as admin in DB)
        const hardcodedAdminsInSystem = result.users.filter(u => 
          hardcodedAdmins.includes(u.email.toLowerCase())
        );
        
        const totalEffectiveAdmins = currentAdmins.length + hardcodedAdminsInSystem.length;
        
        console.log('🔍 ADMIN DEBUG INFO:');
        console.log('Target email:', userEmail);
        console.log('Current admins:', currentAdmins.map(a => a.email));
        console.log('Hardcoded admins:', hardcodedAdmins);
        console.log('Hardcoded admins in system:', hardcodedAdminsInSystem.map(a => a.email));
        console.log('Removable admins:', removableAdmins.map(a => a.email));
        console.log('Total admin count:', currentAdmins.length);
        console.log('Total effective admin count:', totalEffectiveAdmins);
        console.log('Removable admin count:', removableAdmins.length);
        
        // If removing this admin would leave us with no removable admins, prevent it
        // UNLESS there are hardcoded admins that can still manage the system
        const hasHardcodedAdmins = hardcodedAdminsInSystem.length > 0;
        
        // Also check if current user is a hardcoded admin (even if not in user list)
        // Use the currentUserEmail that was already defined above in the fresh admin check
        const currentUserIsHardcoded = hardcodedAdmins.includes(currentUserEmail?.toLowerCase());
        
        console.log('Current user email:', currentUserEmail);
        console.log('Current user is hardcoded admin:', currentUserIsHardcoded);
        
        if (removableAdmins.length <= 1 && !hasHardcodedAdmins && !currentUserIsHardcoded) {
          throw new Error('At least one admin must remain! Another admin is required since you are not a system administrator.');
        }
        
        if (removableAdmins.length <= 1 && (hasHardcodedAdmins || currentUserIsHardcoded)) {
          console.log('⚠️ Last removable admin being removed but hardcoded admin exists, continuing...');
        }

        // Use AdminManager for free admin removal
        const adminResult = await AdminManager.setAdminRole(userEmail.toLowerCase(), false);
        
        console.log('✅ AdminManager result:', result);
        
        alert(`✅ ${userEmail} admin yetkisi başarıyla kaldırıldı!\n\n🔄 Kullanıcının sayfayı yenilemesi gerekiyor.`);
        
        // Clear form and refresh list
        this.newAdminEmail = '';
        await this.loadUsers();
        
      } catch (error) {
        console.error("Error removing admin:", error);
        alert('❌ Admin yetkisi kaldırılamadı:\n\n' + error.message);
      } finally {
        this.isProcessing = false;
      }
    },

    async viewUserDetails(user) {
      try {
        // If user object already exists, use directly but fetch full health data
        if (user && typeof user === 'object') {
          // Get full user document from Firestore to include health data
          const userDoc = await getDoc(doc(db, "users", user.id));
          if (userDoc.exists()) {
            const fullUserData = userDoc.data();
            this.selectedUser = {
              ...user, // Keep the processed user data (hasHealthData, etc.)
              healthData: fullUserData.healthInformation || null, // Add full health data
              userInformation: fullUserData.userInformation || {},
              addressInformation: fullUserData.addressInformation || {}
            };
            console.log('👤 Full user data loaded:', this.selectedUser);
          } else {
            this.selectedUser = user; // Fallback to basic user data
          }
          return;
        }
        
        // If userId is provided, fetch the document
        const userDoc = await getDoc(doc(db, "users", user));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.selectedUser = {
            id: user,
            email: userData.userInformation?.email || 'No email',
            firstName: userData.userInformation?.firstName || 'Unknown',
            surname: userData.userInformation?.surname || userData.userInformation?.lastName || 'Unknown',
            hasHealthData: !!(userData.healthInformation),
            healthData: userData.healthInformation || null,
            userInformation: userData.userInformation || {},
            addressInformation: userData.addressInformation || {},
            ...userData
          };
        } else {
          alert('User data not found!');
        }
      } catch (error) {
        console.error("User data loading error:", error);
        alert('Failed to load user data!');
      }
    },

    closeModal() {
      this.selectedUser = null;
    },

    async toggleSelectedUserAdmin() {
      if (!this.selectedUser) return;
      
      const userEmail = this.selectedUser.email;
      const isAdmin = this.selectedUser.isAdmin;
      
      console.log(`🎯 Toggle admin for selected user: ${userEmail}, currently admin: ${isAdmin}`);
      
      if (isAdmin) {
        // Remove admin
        await this.processAdminRemoval(userEmail);
        // Update selected user state
        this.selectedUser.isAdmin = false;
      } else {
        // Make admin
        await this.processAdminCreation(userEmail);
        // Update selected user state
        this.selectedUser.isAdmin = true;
      }
      
      // Refresh the users list to keep everything in sync
      await this.loadUsers();
    },

    exportToJSON() {
      try {
        const exportData = this.users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          surname: user.surname,
          isAdmin: user.isAdmin,
          hasHealthData: user.hasHealthData,
          createdAt: user.createdAt
        }));
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `users-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        alert('✅ JSON file downloaded successfully!');
      } catch (error) {
        console.error('JSON export error:', error);
        alert('❌ JSON export failed!');
      }
    },

    exportToCSV() {
      try {
        const headers = ['ID', 'Email', 'Ad', 'Soyad', 'Admin', 'Sağlık Verisi', 'Kayıt Tarihi'];
        const csvContent = [
          headers.join(','),
          ...this.users.map(user => [
            user.id,
            `"${user.email}"`,
            `"${user.firstName}"`,
            `"${user.surname}"`,
            user.isAdmin ? 'Evet' : 'Hayır',
            user.hasHealthData ? 'Evet' : 'Hayır',
            user.createdAt || 'Bilinmiyor'
          ].join(','))
        ].join('\n');
        
        const BOM = '\uFEFF'; // UTF-8 BOM for Excel
        const dataBlob = new Blob([BOM + csvContent], {type: 'text/csv;charset=utf-8'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `users-data-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        
        alert('✅ CSV file downloaded successfully!');
      } catch (error) {
        console.error('CSV export error:', error);
        alert('❌ CSV export failed!');
      }
    },

    async updateSettings() {
      console.log('🔧 updateSettings called at:', new Date().toISOString());
      try {
        // First verify admin access
        const isAdmin = AdminManager.isUserAdmin(this.currentUserEmail);
        if (!isAdmin) {
          throw new Error('Admin access required to update settings');
        }

        // Save settings to Firestore
        const settingsRef = doc(db, 'appSettings', 'main');
        await setDoc(settingsRef, {
          ...this.settings,
          lastUpdated: new Date().toISOString(),
          updatedBy: this.currentUserEmail
        }, { merge: true });

        console.log('✅ Settings updated successfully:', this.settings);

        // Apply registration control immediately
        await this.applyRegistrationSettings();
        await this.applyDataRetentionSettings();

      } catch (error) {
        console.error('❌ Error updating settings:', error);
      }
    },

    async changeAdminPassword() {
      if (!this.canChangePassword) return;

      this.passwordChange.isChanging = true;
      
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No authenticated user found');
        }

        // Import Firebase auth functions
        const { updatePassword, reauthenticateWithCredential, EmailAuthProvider } = await import('firebase/auth');

        // Re-authenticate with current password
        const credential = EmailAuthProvider.credential(
          user.email, 
          this.passwordChange.currentPassword
        );
        
        console.log('🔐 Re-authenticating user...');
        await reauthenticateWithCredential(user, credential);
        
        console.log('🔑 Updating password...');
        await updatePassword(user, this.passwordChange.newPassword);
        
        console.log('✅ Password changed successfully');
        
        // Clear the form
        this.passwordChange = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          isChanging: false
        };

        // Success notification (you can replace with toast if available)
        alert('Password changed successfully! You will remain logged in.');
        
      } catch (error) {
        console.error('❌ Password change error:', error);
        
        // Handle specific errors
        let errorMessage = 'Failed to change password. ';
        if (error.code === 'auth/wrong-password') {
          errorMessage = 'Current password is incorrect.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'New password is too weak.';
        } else if (error.code === 'auth/requires-recent-login') {
          errorMessage = 'Please log out and log back in, then try again.';
        } else {
          errorMessage += error.message;
        }
        
        alert(errorMessage);
      } finally {
        this.passwordChange.isChanging = false;
      }
    },

    async loadSettings() {
      try {
        // First verify admin access
        const isAdmin = AdminManager.isUserAdmin(this.currentUserEmail);
        if (!isAdmin) {
          console.warn('⚠️ Non-admin user, using default settings');
          return;
        }

        const settingsRef = doc(db, 'appSettings', 'main');
        const settingsSnap = await getDoc(settingsRef);
        
        if (settingsSnap.exists()) {
          const settingsData = settingsSnap.data();
          // Merge with default settings to ensure all required fields exist
          this.settings = {
            allowRegistration: settingsData.allowRegistration ?? true,
            dataRetentionPeriod: settingsData.dataRetentionPeriod ?? '730',
            emailNotifications: settingsData.emailNotifications ?? true
          };
          console.log('✅ Settings loaded:', this.settings);
        } else {
          // Create default settings document
          await this.updateSettings();
          console.log('✅ Default settings created');
        }
      } catch (error) {
        console.error('❌ Error loading settings:', error);
        // Use default settings on error
      }
    },

    async applyRegistrationSettings() {
      // For now, just log the setting
      // In production, this would integrate with Firebase Security Rules
      console.log(`🔒 Registration ${this.settings.allowRegistration ? 'ENABLED' : 'DISABLED'}`);
      
      if (!this.settings.allowRegistration) {
        console.warn('⚠️ New user registration is now disabled');
        // Here you would typically update Firebase Security Rules via Admin SDK
        // For now, we'll just track the setting
      }
    },

    async applyDataRetentionSettings() {
      console.log(`🗄️ Data retention period set to: ${this.getRetentionPeriodLabel()}`);
      
      if (this.settings.dataRetentionPeriod !== 'never') {
        const days = parseInt(this.settings.dataRetentionPeriod);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        console.log(`📅 Users inactive before ${cutoffDate.toLocaleDateString()} will be marked for deletion`);
        
        // In production, this would:
        // 1. Set up a Cloud Function to run periodically
        // 2. Query users with lastLoginDate < cutoffDate
        // 3. Either delete or anonymize their data
        // 4. Send notifications before deletion
        
        // For now, we'll just count how many users would be affected
        const affectedUsers = this.users.filter(user => {
          const lastLogin = user.userInformation?.lastLoginDate;
          if (!lastLogin) return true; // Users who never logged in
          return new Date(lastLogin) < cutoffDate;
        }).length;
        
        if (affectedUsers > 0) {
          console.log(`⚠️ ${affectedUsers} users would be affected by this retention policy`);
        }
      }
    },

    getRetentionPeriodLabel() {
      switch (this.settings.dataRetentionPeriod) {
        case '365': return '1 Year';
        case '730': return '2 Years';
        case '1095': return '3 Years';
        case 'never': return 'Never';
        default: return 'Unknown';
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'Bilinmiyor';
      try {
        return new Date(dateString).toLocaleDateString('tr-TR');
      } catch {
        return 'Geçersiz tarih';
      }
    },

    getCountryName(countryValue) {
      // Now that we save full country names, just return the value
      return countryValue || 'Not specified';
    },

    getFamilyHistoryLabel(value) {
      const familyHistoryLabels = {
        'BC1': 'Breast Cancer - 1st Degree Relative',
        'BC1_U50': 'Breast Cancer - 1st Degree (Under 50)',
        'BC2_U50': 'Breast Cancer - 2nd Degree (Under 50)', 
        'BC_U45': 'Breast Cancer - Relative (Under 45)',
        'FH_BRCA': 'BRCA Gene Mutation',
        'FH_BRCA1': 'BRCA Gene - 1st Degree Relative',
        'FH_NONBC': 'Other Cancer History'
      };
      return familyHistoryLabels[value] || value;
    },

    formatFamilyHistoryOptions(options) {
      if (!options || !Array.isArray(options)) return 'Not specified';
      return options.map(option => this.getFamilyHistoryLabel(option));
    },

    capitalizeFirstLetter(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    getFullName(user) {
      // Try different possible field combinations from AdminManager and form data
      const firstName = this.capitalizeFirstLetter(
        user.firstName || 
        user.userInformation?.firstName || 
        ''
      );
      
      const middleName = this.capitalizeFirstLetter(
        user.middleName || 
        user.userInformation?.middleName || 
        ''
      );
      
      const lastName = this.capitalizeFirstLetter(
        user.lastName || 
        user.surname || 
        user.userInformation?.surname || 
        user.userInformation?.lastName || 
        ''
      );
      
      let fullName = firstName;
      if (middleName) fullName += ' ' + middleName;
      if (lastName && lastName !== 'Unknown') fullName += ' ' + lastName;
      
      return fullName || 'Not specified';
    },

    getMaidenName(user) {
      return this.capitalizeFirstLetter(user.userInformation?.maidenName || '') || 'Not specified';
    },

    async handleLogout() {
      const confirmed = confirm('Çıkış yapmak istediğinizden emin misiniz?');
      if (!confirmed) return;
      
      try {
        await signOut(auth);
        this.$router.push('/');
      } catch (error) {
        console.error("Logout error:", error);
        alert('Logout failed!');
      }
    },

    async sendAppointmentEmail() {
      try {
        this.isProcessing = true;
        
        const userEmail = this.selectedUser.userInformation?.email || this.selectedUser.email;
        const userName = this.getFullName(this.selectedUser);
        
        if (!userEmail) {
          console.error('Email Error: No email address found for this user');
          return;
        }

        console.log('📧 Preparing to send email to:', userEmail);

        // Prepare email data for Cloud Function
        const emailData = {
          to: userEmail,
          subject: 'Important: Appointment Reminder - Health Tracker',
          message: `Hello ${userName},

We hope this email finds you in good health. 

This is a friendly reminder regarding your healthcare appointment. Please contact us at your earliest convenience to schedule or confirm your appointment.

Our healthcare team is ready to assist you with:
• Health assessment and consultation
• Medical examination scheduling  
• Follow-up care coordination
• Any questions or concerns you may have

Please reach out to us by:
📞 Phone: [Your clinic phone number]
📧 Email: [Your clinic email]
🏥 Visit: [Your clinic address]

Thank you for prioritizing your health. We look forward to hearing from you soon.

Best regards,
Healthcare Team
Breast Cancer Tracker System

---
This email was sent by the system administrator. If you have any questions, please contact support.`,
          senderEmail: this.currentUserEmail
        };

        // Call Firebase Cloud Function
        console.log('� Calling Firebase Cloud Function...');
        const result = await this.simulateEmailSending(emailData);

        console.log('✅ Email sent successfully:', result);

        // Show success message using universal toast method
        console.log('✅ Email Sent: Appointment reminder email sent successfully to', userEmail);

      } catch (error) {
        console.error('❌ Error in email simulation:', error);
        
        let errorMessage = 'Failed to simulate email. Please try again.';
        if (error.message) {
          errorMessage = error.message;
        }
        
        console.error('❌ Email Simulation Failed:', errorMessage);
        
      } finally {
        this.isProcessing = false;
      }
    },

    // Add new method for batch emails
    async sendBatchEmails(recipients, subject, message) {
      try {
        this.isProcessing = true;
        
        if (!recipients || recipients.length === 0) {
          throw new Error('No recipients selected');
        }

        console.log(`📧 Simulating batch emails to ${recipients.length} recipients...`);

        const batchData = {
          recipients: recipients.map(user => ({
            email: user.userInformation?.email || user.email,
            name: this.getFullName(user)
          })),
          subject: subject,
          message: message,
          senderEmail: this.currentUserEmail,
          batchId: 'batch_' + Date.now()
        };

        // Simulate batch email sending
        let sent = 0;
        let failed = 0;

        for (const recipient of batchData.recipients) {
          try {
            await this.simulateEmailSending({
              to: recipient.email,
              subject: subject,
              message: message,
              senderEmail: this.currentUserEmail
            });
            sent++;
            console.log(`✅ Email simulated for: ${recipient.email}`);
          } catch (error) {
            failed++;
            console.error(`❌ Failed to simulate email for ${recipient.email}:`, error);
          }
          // Add small delay between emails for realistic simulation
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const result = { sent, failed, total: recipients.length };
        console.log('✅ Batch email simulation completed:', result);

        return result;

      } catch (error) {
        console.error('❌ Batch email simulation error:', error);
        
        let errorMessage = 'Failed to simulate batch emails. Please try again.';
        if (error.message) {
          errorMessage = error.message;
        }
        
        // Show error message using universal toast method
        console.error('❌ Batch Email Simulation Failed:', errorMessage);
        
        throw error;
      } finally {
        this.isProcessing = false;
      }
    },

    // Get simulated email logs  
    async getEmailLogs() {
      try {
        // Return simulated email logs since Cloud Functions are removed
        const simulatedLogs = [
          {
            id: 'sim_' + Date.now(),
            timestamp: new Date().toISOString(),
            type: 'simulation',
            status: 'info',
            message: 'Email simulation system active - Cloud Functions not deployed',
            details: {
              note: 'All emails are being simulated for development/testing purposes',
              mode: 'simulation_only'
            }
          }
        ];

        console.log('📧 Email logs (simulation mode):', simulatedLogs);
        return simulatedLogs;
      } catch (error) {
        console.error('Failed to get email logs:', error);
        return [];
      }
    },

    async simulateEmailSending(emailTemplate) {
      // Enhanced simulation for development when Cloud Functions are not available
      console.log('📧 EMAIL SIMULATION MODE ACTIVATED');
      console.log('=====================================');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log the email content (for development)
      console.log('📧 EMAIL DETAILS (SIMULATED):');
      console.log('To:', emailTemplate.to);
      console.log('Subject:', emailTemplate.subject);
      console.log('From Admin:', emailTemplate.senderEmail);
      console.log('---');
      console.log('Message Preview:');
      console.log(emailTemplate.message);
      console.log('=====================================');
      
      return { 
        success: true, 
        messageId: 'sim_' + Date.now(),
        note: 'Email simulated - Cloud Functions not deployed' 
      };
    },

    // Batch Email Management Methods
    selectAllUsers() {
      this.selectedRecipients = [...this.users];
      
      // Also update multiselect visual selection
      const multiselect = document.getElementById('user-multiselect');
      if (multiselect) {
        for (let option of multiselect.options) {
          option.selected = true;
        }
      }
      
      console.log(`Selected all ${this.users.length} users for batch email`);
    },

    // New modern recipient selection methods
    isUserSelected(user) {
      return this.selectedRecipients.some(r => r.id === user.id);
    },

    toggleUserSelection(user) {
      if (this.isProcessing) return;
      
      if (this.isUserSelected(user)) {
        this.removeUserSelection(user);
      } else {
        if (this.selectedRecipients.length < 50) {
          this.selectedRecipients.push(user);
          console.log(`Added ${this.getFullName(user)} to selection`);
        }
      }
    },

    removeUserSelection(user) {
      const index = this.selectedRecipients.findIndex(r => r.id === user.id);
      if (index > -1) {
        this.selectedRecipients.splice(index, 1);
        console.log(`Removed ${this.getFullName(user)} from selection`);
      }
    },

    selectAllUsers() {
      if (this.filteredRecipients.length > 50) {
        this.selectedRecipients = this.filteredRecipients.slice(0, 50);
      } else {
        this.selectedRecipients = [...this.filteredRecipients];
      }
      console.log(`Selected ${this.selectedRecipients.length} users (all filtered)`);
    },

    selectHealthDataUsers() {
      const healthUsers = this.filteredRecipients.filter(user => user.hasHealthData);
      if (healthUsers.length > 50) {
        this.selectedRecipients = healthUsers.slice(0, 50);
      } else {
        this.selectedRecipients = [...healthUsers];
      }
      console.log(`Selected ${this.selectedRecipients.length} health data users`);
    },

    clearSelection() {
      this.selectedRecipients = [];
      console.log('Cleared all recipient selections');
    },

    // Old method - keep for compatibility but not used with new UI
    handleUserSelection(event) {
      // Get selected option values from multiselect
      const selectedIds = Array.from(event.target.selectedOptions).map(option => option.value);
      
      // Find users by selected IDs
      this.selectedRecipients = this.users.filter(user => selectedIds.includes(user.id));
      
      console.log(`Selected ${this.selectedRecipients.length} users via multiselect`);
    },

    removeRecipient(recipient) {
      const index = this.selectedRecipients.findIndex(r => r.id === recipient.id);
      if (index > -1) {
        this.selectedRecipients.splice(index, 1);
        console.log(`Removed ${recipient.email} from recipients`);
      }
    },

    async sendBatchEmailToSelected() {
      if (!this.canSendBatchEmail) {
        console.warn('Invalid Selection: Please select recipients and fill in email details');
        return;
      }

      try {
        console.log(`🚀 Sending batch email to ${this.selectedRecipients.length} recipients`);
        
        const result = await this.sendBatchEmails(
          this.selectedRecipients,
          this.batchEmail.subject,
          this.batchEmail.message
        );

        // Clear form after successful send
        this.selectedRecipients = [];
        this.batchEmail.subject = '';
        this.batchEmail.message = '';
        
        // Refresh email logs
        await this.loadEmailLogs();

      } catch (error) {
        console.error('Batch email failed:', error);
        // Error handling is done in sendBatchEmails method
      }
    },

    previewBatchEmail() {
      if (!this.batchEmail.subject || !this.batchEmail.message) {
        console.warn('Missing Content: Please fill in subject and message to preview');
        return;
      }

      const sampleUser = this.selectedRecipients[0] || { 
        firstName: 'John', 
        surname: 'Doe',
        userInformation: { firstName: 'John', surname: 'Doe' }
      };
      
      const previewMessage = this.batchEmail.message.replace(/\[USER_NAME\]/g, this.getFullName(sampleUser));
      
      // Email preview information
      console.log('📧 Email Preview', 
        `Subject: ${this.batchEmail.subject}\n\nMessage Preview:\n${previewMessage.substring(0, 200)}${previewMessage.length > 200 ? '...' : ''}`);
    },

    useTemplate(templateName) {
      // Prevent double-clicking by checking if currently processing
      if (this.isProcessing) return;
      
      if (this.emailTemplates[templateName]) {
        // Set processing flag temporarily to prevent rapid clicks
        this.isProcessing = true;
        
        this.batchEmail.subject = this.emailTemplates[templateName].subject;
        this.batchEmail.message = this.emailTemplates[templateName].message;
        
        // Reset processing flag after a short delay
        setTimeout(() => {
          this.isProcessing = false;
        }, 1000);
      }
    },

    async loadEmailLogs() {
      try {
        console.log('📋 Loading email logs...');
        this.emailLogs = await this.getEmailLogs();
        console.log(`✅ Loaded ${this.emailLogs.length} email logs`);
      } catch (error) {
        console.error('Failed to load email logs:', error);
        console.log('❌ Load Failed: Could not load email history');
      }
    },

    formatLogDate(dateString) {
      if (!dateString) return 'Unknown';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'Invalid Date';
      }
    }
  }
};
</script>

<style scoped>
@import '../style/AdminView.css';
</style>
