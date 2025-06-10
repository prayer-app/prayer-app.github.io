// Import date-fns-tz functions
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

// Constants
const STORAGE_KEYS = {
    PRAYERS: 'prayers',
    PRAISES: 'praises'
};

const SELECTORS = {
    PRAYER_LIST: '#prayerList',
    ARCHIVED_PRAYER_LIST: '#archivedPrayerList',
    ANSWERED_PRAYER_LIST: '#answeredPrayerList',
    PRAISE_LIST: '#praiseList',
    PRAYER_FORM: '#prayerForm',
    PRAISE_FORM: '#praiseForm',
    FOLLOWUP_FORM: '#followupForm',
    EDIT_PRAYER_FORM: '#editPrayerForm',
    ADD_PRAYER_BTN: '#addPrayerBtn',
    ADD_PRAISE_BTN: '#addPraiseBtn',
    RESET_DB_BTN: '#resetDatabaseBtn',
    EXPORT_DATA_BTN: '#exportDataBtn'
};

// State management
let prayerToRemove = null;
let prayerToFollowup = null;
const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Initialize data in localStorage
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.PRAYERS)) {
        localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRAISES)) {
        localStorage.setItem(STORAGE_KEYS.PRAISES, JSON.stringify([]));
    }
}

// Date handling functions
function getTodayLocal() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

function localToUTC(date) {
    // Create a new date object to avoid modifying the input
    const localDate = new Date(date);
    // Set the time to noon to avoid any date shifting
    localDate.setHours(12, 0, 0, 0);
    const utcDate = zonedTimeToUtc(localDate, localTimezone);
    return utcDate;
}

function utcToLocal(utcDate) {
    // Create a new date object to avoid modifying the input
    const date = new Date(utcDate);
    // Set the time to noon to avoid any date shifting
    date.setHours(12, 0, 0, 0);
    const localDate = utcToZonedTime(date, localTimezone);
    return localDate;
}

// Helper Functions
const formatDateForStorage = (date) => {
    if (!date) return null;
    try {
        // Convert to ISO string and store in UTC
        return date.toISOString();
    } catch (error) {
        console.error('Error formatting date:', error);
        return null;
    }
};

const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return format(date, 'MMM d, yyyy');
    } catch (error) {
        console.error('Error formatting date for display:', error);
        return '';
    }
};

// Format date to "SEPT 5th 2025" format for display
function formatDate(dateString) {
    // Create a new date object to avoid modifying the input
    const date = new Date(dateString);
    // Set the time to noon to avoid any date shifting
    date.setHours(12, 0, 0, 0);
    const localDate = utcToLocal(date);
    const formattedDate = formatInTimeZone(localDate, localTimezone, 'MMM do yyyy');
    return formattedDate.toUpperCase();
}

// Data management functions
function getPrayers() {
    try {
        const prayers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRAYERS));
        if (!Array.isArray(prayers)) {
            console.warn('Prayers data was not an array, resetting to empty array');
            localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify([]));
            return [];
        }
        return prayers;
    } catch (error) {
        console.error('Error parsing prayers from localStorage:', error);
        localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify([]));
        return [];
    }
}

function getPraises() {
    try {
        const praises = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRAISES));
        if (!Array.isArray(praises)) {
            console.warn('Praises data was not an array, resetting to empty array');
            localStorage.setItem(STORAGE_KEYS.PRAISES, JSON.stringify([]));
            return [];
        }
        return praises;
    } catch (error) {
        console.error('Error parsing praises from localStorage:', error);
        localStorage.setItem(STORAGE_KEYS.PRAISES, JSON.stringify([]));
        return [];
    }
}

function savePrayers(prayers) {
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
}

function savePraises(praises) {
    localStorage.setItem(STORAGE_KEYS.PRAISES, JSON.stringify(praises));
}

// UI rendering functions
function renderPrayerList() {
    const prayers = getPrayers();
    const $prayerList = $(SELECTORS.PRAYER_LIST);
    const $archivedPrayerList = $(SELECTORS.ARCHIVED_PRAYER_LIST);
    const $answeredPrayerList = $(SELECTORS.ANSWERED_PRAYER_LIST);
    
    console.log('Total prayers:', prayers.length);
    console.log('Answered prayers:', prayers.filter(p => p.is_answered).length);
    
    $prayerList.empty();
    $archivedPrayerList.empty();
    $answeredPrayerList.empty();

    // Filter out removed prayers and sort by latest follow-up date
    const activePrayers = prayers.filter(prayer => !prayer.is_removed);
    console.log('Active prayers:', activePrayers.length);
    
    activePrayers.sort((a, b) => {
        const aDate = a.followups[a.followups.length - 1]?.followup_at;
        const bDate = b.followups[b.followups.length - 1]?.followup_at;
        return new Date(aDate) - new Date(bDate);
    });

    let answeredCount = 0;
    let archivedCount = 0;
    let activeCount = 0;

    activePrayers.forEach((prayer, index) => {
        const latestFollowup = prayer.followups[prayer.followups.length - 1];
        const row = createPrayerRow(prayer, latestFollowup, index);
        
        // Answered Prayers section: is_answered: true, is_archived: false, is_removed: false
        if (prayer.is_answered && !prayer.is_archived) {
            $answeredPrayerList.append(row);
            answeredCount++;
        }
        // Archived Prayers section: is_archived: true
        else if (prayer.is_archived) {
            $archivedPrayerList.append(row);
            archivedCount++;
        }
        // Active Prayers section: is_answered: false, is_archived: false, is_removed: false
        else {
            $prayerList.append(row);
            activeCount++;
        }
    });

    console.log('Rendered counts:', { active: activeCount, answered: answeredCount, archived: archivedCount });

    // Show/hide archived section
    const $archivedSection = $archivedPrayerList.closest('.col-12');
    $archivedSection.toggle($archivedPrayerList.children().length > 0);

    // Show/hide answered section
    const $answeredSection = $answeredPrayerList.closest('.col-12');
    $answeredSection.toggle($answeredPrayerList.children().length > 0);
}

function createPrayerRow(prayer, latestFollowup, index) {
    let actionButtons;
    if (prayer.is_archived) {
        actionButtons = createArchivedActionButtons(prayer, index);
    } else if (prayer.is_answered) {
        actionButtons = createAnsweredActionButtons(prayer, index);
    } else {
        actionButtons = createActiveActionButtons(prayer, index);
    }

    return `
        <tr class="prayer-row" data-id="${prayer.id}" style="cursor: pointer;">
            <td>${prayer.person}</td>
            <td class="followup-date" data-id="${prayer.id}" style="cursor: pointer;">
                ${formatDate(latestFollowup.followup_at)}
            </td>
            <td>${latestFollowup.followedup_at ? formatDate(latestFollowup.followedup_at) : '-'}</td>
            <td class="text-end">${actionButtons}</td>
        </tr>
    `;
}

function createArchivedActionButtons(prayer, index) {
    return `
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-link prayer-archive" data-id="${prayer.id}" title="Unarchive Prayer">
                <i class="bi bi-archive-fill text-warning"></i>
            </button>
            <button type="button" class="btn btn-link prayer-remove" data-id="${prayer.id}" title="Remove Prayer">
                <i class="bi bi-x-circle-fill text-secondary"></i>
            </button>
        </div>
    `;
}

function createAnsweredActionButtons(prayer, index) {
    return `
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-link prayer-answered" data-id="${prayer.id}" title="Prayer Answered">
                <i class="bi bi-star-fill text-success"></i>
            </button>
            <button type="button" class="btn btn-link prayer-archive" data-id="${prayer.id}" title="Archive Prayer">
                <i class="bi bi-archive-fill text-secondary"></i>
            </button>
            <button type="button" class="btn btn-link prayer-remove" data-id="${prayer.id}" title="Remove Prayer">
                <i class="bi bi-x-circle-fill text-secondary"></i>
            </button>
        </div>
    `;
}

function createActiveActionButtons(prayer, index) {
    return `
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-link prayer-answered" data-id="${prayer.id}" title="Prayer Answered">
                <i class="bi ${prayer.is_answered ? 'bi-star-fill text-success' : 'bi-star-fill text-secondary'}"></i>
            </button>
            <button type="button" class="btn btn-link prayer-calendar" data-id="${prayer.id}" title="Follow up details">
                <i class="bi bi-calendar3-event-fill text-secondary"></i>
            </button>
            <button type="button" class="btn btn-link prayer-edit" data-id="${prayer.id}" title="Edit Prayer">
                <i class="bi bi-pen-fill text-secondary"></i>
            </button>
            <button type="button" class="btn btn-link prayer-archive" data-id="${prayer.id}" title="Archive Prayer">
                <i class="bi bi-archive-fill text-secondary"></i>
            </button>
            <button type="button" class="btn btn-link prayer-remove" data-id="${prayer.id}" title="Remove Prayer">
                <i class="bi bi-x-circle-fill text-secondary"></i>
            </button>
        </div>
    `;
}

function renderPraiseList() {
    const praiseList = document.getElementById('praiseList');
    const archivedPraiseList = document.getElementById('archivedPraiseList');
    
    // If elements don't exist yet, return early
    if (!praiseList || !archivedPraiseList) {
        console.warn('Praise list elements not found in DOM');
        return;
    }
    
    // Clear existing lists
    praiseList.innerHTML = '';
    archivedPraiseList.innerHTML = '';
    
    // Get and sort praises
    const praises = getPraises();
    const activePraises = praises.filter(p => !p.is_archived);
    const archivedPraises = praises.filter(p => p.is_archived);
    
    // Sort by date (newest first)
    activePraises.sort((a, b) => new Date(b.date) - new Date(a.date));
    archivedPraises.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render active praises
    activePraises.forEach(praise => {
        const row = createPraiseRow(praise);
        praiseList.appendChild(row);
    });
    
    // Render archived praises
    archivedPraises.forEach(praise => {
        const row = createPraiseRow(praise);
        archivedPraiseList.appendChild(row);
    });
    
    // Show/hide archived section based on content
    const archivedSection = archivedPraiseList.closest('.col-12');
    if (archivedSection) {
        archivedSection.style.display = archivedPraises.length > 0 ? 'block' : 'none';
    }
}

// Generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Event handlers
function handlePrayerFormSubmit(e) {
    e.preventDefault();
    
    const followupDate = $('form #followup_at').val();
    const person = $('form #person').val();
    const prayerText = $("form #prayer").val();
    
    const date = new Date(followupDate);
    date.setHours(0, 0, 0, 0);
    
    const prayer = {
        id: generateUUID(),
        person: person,
        prayer: prayerText,
        followups: [{
            followup_at: formatDateForStorage(date),
            followedup_at: null,
            did_followup: false
        }],
        is_answered: false,
        is_removed: false,
        is_archived: false
    };

    const prayers = getPrayers();
    prayers.push(prayer);
    savePrayers(prayers);

    // Reset form
    $('#prayerForm')[0].reset();
    
    // Close modal
    const prayerModal = bootstrap.Modal.getInstance(document.getElementById('prayerModal'));
    if (prayerModal) {
        prayerModal.hide();
    }
    
    // Refresh the list
    renderPrayerList();
}

function handlePraiseFormSubmit(e) {
    e.preventDefault();
    
    const praise = {
        praise: $('#praise').val(),
        is_removed: false,
        praised_at: formatDateForStorage(new Date())
    };

    const praises = getPraises();
    praises.push(praise);
    savePraises(praises);

    this.reset();
    bootstrap.Modal.getInstance(document.getElementById('praiseModal')).hide();
    renderPraiseList();
}

function handleFollowupStatusClick(e) {
    e.stopPropagation();
    const button = e.target.closest('button');
    if (!button) return;
    
    const row = button.closest('tr');
    const prayerId = parseInt(row.dataset.id);
    const prayers = getPrayers();
    const prayer = prayers.find(p => p.id === prayerId);
    
    if (prayer) {
        const latestFollowup = prayer.followups[prayer.followups.length - 1];
        if (latestFollowup) {
            latestFollowup.followedup_at = new Date().toISOString();
            savePrayers(prayers);
            renderPrayerList();
        }
    }
}

function updateFollowupUI($button, followup) {
    const $icon = $button.find('i');
    if (followup.did_followup) {
        $icon.removeClass('text-secondary').addClass('text-success');
    } else {
        $icon.removeClass('text-success').addClass('text-secondary');
    }
    $button.attr('title', followup.did_followup ? 'Mark as not followed up' : 'Mark as followed up');
}

function updateFollowupFormState(prayer) {
    const allFollowedUp = prayer.followups.every(f => f.did_followup);
    const $submitBtn = $('#followupForm button[type="submit"]');
    const $dateInput = $('#newFollowupDate');
    
    $submitBtn.prop('disabled', !allFollowedUp);
    $dateInput.prop('disabled', !allFollowedUp);
    
    if (allFollowedUp) {
        $submitBtn.removeClass('btn-secondary').addClass('btn-primary');
    } else {
        $submitBtn.removeClass('btn-primary').addClass('btn-secondary');
    }
    
    $dateInput.attr('title', allFollowedUp ? 'Select a new follow-up date' : 'Complete all follow-ups to set a new date');
}

// Initialize the application
function initializeApp() {
    initializeStorage();
    renderPrayerList();
    renderPraiseList();

    // Event listeners
    $(SELECTORS.PRAYER_FORM).on('submit', handlePrayerFormSubmit);
    $(SELECTORS.PRAISE_FORM).on('submit', handlePraiseFormSubmit);
    $(document).on('click', '.followup-status', handleFollowupStatusClick);
    
    // Tab handling
    $('a[data-bs-toggle="pill"]').on('shown.bs.tab', function(e) {
        const targetId = $(e.target).attr('href');
        $(SELECTORS.ADD_PRAYER_BTN).toggle(targetId === '#prayer');
        $(SELECTORS.ADD_PRAISE_BTN).toggle(targetId === '#praise');
    });

    // Initial button state
    $(SELECTORS.ADD_PRAYER_BTN).show();
    $(SELECTORS.ADD_PRAISE_BTN).hide();
}

// Start the application
$(document).ready(initializeApp);

// Handle prayer action buttons
$(document).on('click', '.prayer-answered', function(e) {
    e.stopPropagation(); // Prevent prayer details modal from showing
    const prayerId = $(this).data('id');
    const prayers = getPrayers();
    const prayer = prayers.find(p => p.id === prayerId);
    
    if (!prayer) {
        console.error('Prayer not found with ID:', prayerId);
        return;
    }
    
    console.log('Before toggle - Prayer answered:', prayer.is_answered);
    prayer.is_answered = !prayer.is_answered;
    console.log('After toggle - Prayer answered:', prayer.is_answered);
    
    savePrayers(prayers);
    
    // Update the icon directly
    const $icon = $(this).find('i');
    if (prayer.is_answered) {
        $icon.removeClass('text-secondary').addClass('text-success');
    } else {
        $icon.removeClass('text-success').addClass('text-secondary');
    }
    
    // Refresh the list to move the prayer to the correct section
    renderPrayerList();
});

$(document).on('click', '.prayer-remove', function(e) {
    e.stopPropagation(); // Prevent prayer details modal from showing
    const prayerId = $(this).data('id');
    const removeModal = new bootstrap.Modal(document.getElementById('removeConfirmModal'));
    removeModal.show();

    $('#confirmRemove').on('click', function() {
        const prayers = getPrayers();
        const prayer = prayers.find(p => p.id === prayerId);
        if (prayer) {
            prayer.is_removed = true;
            savePrayers(prayers);
        }
        // Close the modal
        const removeModal = bootstrap.Modal.getInstance(document.getElementById('removeConfirmModal'));
        removeModal.hide();
        renderPrayerList();
    });
});

$(document).on('click', '.prayer-archive', function() {
    const prayerId = $(this).data('id');
    const prayers = JSON.parse(localStorage.getItem('prayers'));
    const prayer = prayers.find(p => p.id === prayerId);
    
    // Toggle archive status
    prayer.is_archived = !prayer.is_archived;
    
    // Update button title based on new status
    $(this).attr('title', prayer.is_archived ? 'Archive Prayer' : 'Unarchive Prayer');
    
    localStorage.setItem('prayers', JSON.stringify(prayers));
    renderPrayerList();
});

// Handle prayer row click to show details
$(document).on('click', '.prayer-row', function(e) {
    // Don't show details if clicking on action buttons
    if ($(e.target).closest('.btn-group, .btn-link').length) {
        return;
    }

    const prayerId = $(this).data('id');
    const prayers = getPrayers();
    const prayer = prayers.find(p => p.id === prayerId);
    
    if (!prayer) {
        console.error('Prayer not found with ID:', prayerId);
        return;
    }
    
    const latestFollowup = prayer.followups[prayer.followups.length - 1];

    // Update modal content
    $('#detailsPerson').text(prayer.person);
    $('#detailsPrayer').text(prayer.prayer);
    $('#detailsFollowup').text(formatDate(latestFollowup.followup_at));
    $('#detailsStatus').html(`
        <span class="badge ${prayer.is_answered ? 'bg-success' : 'bg-secondary'} me-2">
            ${prayer.is_answered ? 'Answered' : 'Not Answered'}
        </span>
        <span class="badge ${prayer.is_archived ? 'bg-warning' : 'bg-success'}">
            ${prayer.is_archived ? 'Archived' : 'Active'}
        </span>
    `);

    // Show the modal
    const detailsModal = new bootstrap.Modal(document.getElementById('prayerDetailsModal'));
    detailsModal.show();
});

// Handle calendar button click
$(document).on('click', '.prayer-calendar', function(e) {
    e.stopPropagation(); // Prevent prayer details modal from showing
    const prayerId = $(this).data('id');
    
    // Toggle active state
    if (prayerToFollowup === prayerId) {
        prayerToFollowup = null;
        const followupModal = bootstrap.Modal.getInstance(document.getElementById('followupModal'));
        if (followupModal) {
            followupModal.hide();
        }
    } else {
        prayerToFollowup = prayerId;
        const prayers = getPrayers();
        const prayer = prayers.find(p => p.id === prayerId);
        
        if (!prayer) {
            console.error('Prayer not found with ID:', prayerId);
            return;
        }

        // Set minimum date to tomorrow in local timezone
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        $('#newFollowupDate').attr('min', tomorrow.toISOString().split('T')[0]);

        // Render follow-up history
        const $history = $('#followupHistory');
        $history.empty();

        // Create array of all follow-up dates including current
        const allFollowups = [
            ...prayer.followups
        ];

        // Sort followups by date
        allFollowups.sort((a, b) => new Date(b.followup_at) - new Date(a.followup_at));

        if (allFollowups.length > 0) {
            const historyTable = `
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Follow-up On</th>
                            <th>Followed-up At</th>
                            <th class="text-end">Did Follow-up</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allFollowups.map(followup => {
                            const followupDate = new Date(followup.followup_at);
                            const today = new Date();
                            return `
                                <tr>
                                    <td>${formatDate(followup.followup_at)}</td>
                                    <td>${followup.followedup_at ? formatDate(followup.followedup_at) : '-'}</td>
                                    <td class="text-end">
                                        <button type="button" class="btn btn-link followup-status" 
                                            data-date="${followup.followup_at}" 
                                            title="${followup.did_followup ? 'Mark as not followed up' : 'Mark as followed up'}">
                                            <i class="bi ${followup.did_followup ? 'bi-check-circle-fill text-success' : 'bi-check-circle-fill text-secondary'}"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
            $history.html(historyTable);
        }

        // Check if all follow-ups are completed
        const allFollowedUp = allFollowups.every(followup => followup.did_followup);
        
        // Enable/disable the Set Follow-up button and input
        const $submitBtn = $('#followupForm button[type="submit"]');
        const $dateInput = $('#newFollowupDate');
        
        if (allFollowedUp) {
            $submitBtn.prop('disabled', false);
            $dateInput.prop('disabled', false);
            $submitBtn.removeClass('btn-secondary').addClass('btn-primary');
        } else {
            $submitBtn.prop('disabled', true);
            $dateInput.prop('disabled', true);
            $submitBtn.removeClass('btn-primary').addClass('btn-secondary');
        }

        // Show the modal
        const followupModal = new bootstrap.Modal(document.getElementById('followupModal'));
        followupModal.show();
    }

    // Refresh the list to update active states
    renderPrayerList();
});

// Handle follow-up form submission
$('#followupForm').on('submit', function(e) {
    e.preventDefault();
    
    if (prayerToFollowup === null) return;

    const prayers = getPrayers();
    const prayer = prayers.find(p => p.id === prayerToFollowup);
    
    const newFollowupDate = $('#newFollowupDate').val();
    if (!newFollowupDate) return; // Prevent submission if no follow-up date
    
    // Create date at midnight in local timezone
    const date = new Date(newFollowupDate);
    date.setHours(0, 0, 0, 0);
    
    // Ensure we're storing the correct date in UTC
    const formattedDate = formatDateForStorage(date);
    
    // Add new follow-up
    if (!prayer.followups) {
        prayer.followups = [];
    }
    
    prayer.followups.push({
        followup_at: formattedDate,
        followedup_at: null,
        did_followup: false
    });
    
    // Sort followups by date
    prayer.followups.sort((a, b) => {
        const dateA = new Date(a.followup_at);
        const dateB = new Date(b.followup_at);
        return dateB - dateA;
    });
    
    savePrayers(prayers);
    
    // Clear form and close modal
    this.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('followupModal'));
    modal.hide();
    
    // Update the list view with the new follow-up date
    const $prayerRow = $(`.prayer-row[data-index="${prayerToFollowup}"]`);
    const $followupDateCell = $prayerRow.find('td:nth-child(2)');
    $followupDateCell.text(formatDate(formattedDate));
    
    // Reset the prayerToFollowup state
    prayerToFollowup = null;
    
    // Refresh prayer list
    renderPrayerList();
});

// Handle edit prayer button click
$(document).on('click', '.prayer-edit', function(e) {
    e.stopPropagation(); // Prevent prayer details modal from showing
    const prayerId = $(this).data('id');
    const prayers = getPrayers();
    const prayer = prayers.find(p => p.id === prayerId);
    
    if (!prayer) return;
    
    const latestFollowup = prayer.followups[prayer.followups.length - 1];

    // Set minimum date to today in local timezone
    const todayLocal = getTodayLocal();
    $('#editFollowupAt').attr('min', formatDateForStorage(todayLocal));
    
    // Populate the edit form
    $('#editPrayerForm #editPrayerIndex').val(prayer.id);
    $('#editPrayerForm #editPerson').val(prayer.person);
    $('#editPrayerForm #editPrayer').val(prayer.prayer);
    
    // Format the follow-up date for the input field (YYYY-MM-DD)
    const followupDate = new Date(latestFollowup.followup_at);
    const formattedDate = followupDate.toISOString().split('T')[0];
    $('#editPrayerForm #editFollowupAt').val(formattedDate);

    // Create and show the modal
    const editModal = new bootstrap.Modal(document.getElementById('editPrayerModal'));
    editModal.show();
});

// Handle edit prayer form submission
const handleEditPrayerFormSubmit = (e) => {
    e.preventDefault();
    
    const form = e.target;
    const prayerId = form.getAttribute('data-prayer-id');
    if (!prayerId) {
        console.error('No prayer ID found in form');
        return;
    }

    const prayers = getPrayers();
    const prayerIndex = prayers.findIndex(p => p.id === prayerId);
    
    if (prayerIndex === -1) {
        console.error('Prayer not found');
        return;
    }

    const prayer = prayers[prayerIndex];
    const updatedPrayer = {
        ...prayer,
        title: form.querySelector('#editPrayerTitle').value.trim(),
        description: form.querySelector('#editPrayerDescription').value.trim(),
        followup_date: form.querySelector('#editPrayerFollowupDate').value ? 
            formatDateForStorage(new Date(form.querySelector('#editPrayerFollowupDate').value)) : null,
        updated_at: new Date().toISOString()
    };

    prayers[prayerIndex] = updatedPrayer;
    savePrayers(prayers);
    
    // Close the modal
    const editPrayerModal = bootstrap.Modal.getInstance(document.getElementById('editPrayerModal'));
    if (editPrayerModal) {
        editPrayerModal.hide();
    }
    
    // Refresh the prayer list
    renderPrayerList();
};

// Handle reset database button click
const handleResetDatabase = () => {
    if (confirm('Are you sure you want to reset the database? This will delete all prayers and praises.')) {
        localStorage.removeItem(STORAGE_KEYS.PRAYERS);
        localStorage.removeItem(STORAGE_KEYS.PRAISES);
        initializeStorage();
        renderPrayerList();
        renderPraiseList();
    }
};

// Handle export data button click
const handleExportData = () => {
    const data = {
        prayers: getPrayers(),
        praises: getPraises()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prayer-praise-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize storage
    initializeStorage();
    
    // Initialize reset database button
    const resetDatabaseBtn = document.getElementById('resetDatabaseBtn');
    if (resetDatabaseBtn) {
        resetDatabaseBtn.addEventListener('click', handleResetDatabase);
    }
    
    // Initialize export data button
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', handleExportData);
    }
    
    // Initialize tab change handler for floating action button
    const tabEls = document.querySelectorAll('button[data-bs-toggle="tab"], a[data-bs-toggle="tab"]');
    tabEls.forEach(tabEl => {
        tabEl.addEventListener('shown.bs.tab', (e) => {
            const targetId = e.target.getAttribute('data-bs-target') || e.target.getAttribute('href');
            const floatingBtn = document.getElementById('floatingActionBtn');
            if (!floatingBtn) return;
            
            const floatingBtnIcon = floatingBtn.querySelector('i');
            const floatingBtnText = floatingBtn.querySelector('span');
            
            if (targetId === '#prayer') {
                floatingBtn.setAttribute('data-bs-target', '#addPrayerModal');
                floatingBtnIcon.className = 'bi bi-plus-lg';
                floatingBtnText.textContent = 'Add Prayer';
            } else if (targetId === '#praise') {
                floatingBtn.setAttribute('data-bs-target', '#addPraiseModal');
                floatingBtnIcon.className = 'bi bi-plus-lg';
                floatingBtnText.textContent = 'Add Praise';
            }
        });
    });
    
    // Initialize floating action button
    const floatingBtn = document.getElementById('floatingActionBtn');
    if (floatingBtn) {
        floatingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const activeTab = document.querySelector('button[data-bs-toggle="tab"].active, a[data-bs-toggle="tab"].active');
            if (!activeTab) return;
            
            const targetId = activeTab.getAttribute('data-bs-target') || activeTab.getAttribute('href');
            let modalEl;
            
            if (targetId === '#prayer') {
                modalEl = document.getElementById('addPrayerModal');
            } else if (targetId === '#praise') {
                modalEl = document.getElementById('addPraiseModal');
            }
            
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl, {
                    backdrop: true,
                    keyboard: true,
                    focus: true
                });
                modal.show();
            }
        });
    }
    
    // Initialize add prayer form submission
    const addPrayerForm = document.getElementById('addPrayerForm');
    if (addPrayerForm) {
        addPrayerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const person = document.getElementById('person').value.trim();
            const prayer = document.getElementById('prayer').value.trim();
            const followupDate = document.getElementById('followup_at').value;
            
            if (person && prayer && followupDate) {
                const prayers = getPrayers();
                const newPrayer = {
                    id: Date.now(),
                    person: person,
                    prayer: prayer,
                    followup_date: formatDateForStorage(new Date(followupDate)),
                    created_at: new Date().toISOString(),
                    is_archived: false,
                    is_answered: false,
                    followups: []
                };
                
                prayers.push(newPrayer);
                savePrayers(prayers);
                
                // Close the modal
                const addPrayerModal = bootstrap.Modal.getInstance(document.getElementById('addPrayerModal'));
                if (addPrayerModal) {
                    addPrayerModal.hide();
                }
                
                // Reset the form
                addPrayerForm.reset();
                
                // Refresh the prayer list
                renderPrayerList();
            }
        });
    }
    
    // Initialize add praise form submission
    const addPraiseForm = document.getElementById('addPraiseForm');
    if (addPraiseForm) {
        addPraiseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const praiseText = document.getElementById('praiseText').value.trim();
            
            if (praiseText) {
                const praises = getPraises();
                const newPraise = {
                    id: Date.now(),
                    text: praiseText,
                    date: new Date().toISOString(),
                    is_archived: false
                };
                
                praises.push(newPraise);
                savePraises(praises);
                
                // Close the modal
                const addPraiseModal = bootstrap.Modal.getInstance(document.getElementById('addPraiseModal'));
                if (addPraiseModal) {
                    addPraiseModal.hide();
                }
                
                // Reset the form
                addPraiseForm.reset();
                
                // Refresh the praise list
                renderPraiseList();
            }
        });
    }
    
    // Initialize prayer list event delegation
    const prayerList = document.getElementById('prayerList');
    if (prayerList) {
        prayerList.addEventListener('click', handlePrayerAction);
    }
    
    const archivedPrayerList = document.getElementById('archivedPrayerList');
    if (archivedPrayerList) {
        archivedPrayerList.addEventListener('click', handlePrayerAction);
    }
    
    const answeredPrayerList = document.getElementById('answeredPrayerList');
    if (answeredPrayerList) {
        answeredPrayerList.addEventListener('click', handlePrayerAction);
    }
    
    // Initialize praise list event delegation
    const praiseList = document.getElementById('praiseList');
    if (praiseList) {
        praiseList.addEventListener('click', handlePraiseAction);
    }
    
    const archivedPraiseList = document.getElementById('archivedPraiseList');
    if (archivedPraiseList) {
        archivedPraiseList.addEventListener('click', handlePraiseAction);
    }
    
    // Initialize followup form submission
    const followupForm = document.getElementById('followupForm');
    if (followupForm) {
        followupForm.addEventListener('submit', handleFollowupFormSubmit);
    }
    
    // Initialize edit prayer form submission
    const editPrayerForm = document.getElementById('editPrayerForm');
    if (editPrayerForm) {
        editPrayerForm.addEventListener('submit', handleEditPrayerFormSubmit);
    }
    
    // Initialize followup status click handler
    const followupStatus = document.querySelector('.followup-status');
    if (followupStatus) {
        followupStatus.addEventListener('click', handleFollowupStatusClick);
    }
    
    // Initialize followup date click handler
    const followupDate = document.querySelector('.followup-date');
    if (followupDate) {
        followupDate.addEventListener('click', handleFollowupDateClick);
    }
    
    // Initialize prayer answered click handler
    const prayerAnswered = document.querySelector('.prayer-answered');
    if (prayerAnswered) {
        prayerAnswered.addEventListener('click', handlePrayerAnsweredClick);
    }
    
    // Initialize prayer archive click handler
    const prayerArchive = document.querySelector('.prayer-archive');
    if (prayerArchive) {
        prayerArchive.addEventListener('click', handlePrayerArchiveClick);
    }
    
    // Initialize prayer remove click handler
    const prayerRemove = document.querySelector('.prayer-remove');
    if (prayerRemove) {
        prayerRemove.addEventListener('click', handlePrayerRemoveClick);
    }
    
    // Initialize prayer calendar click handler
    const prayerCalendar = document.querySelector('.prayer-calendar');
    if (prayerCalendar) {
        prayerCalendar.addEventListener('click', handlePrayerCalendarClick);
    }
    
    // Initialize prayer edit click handler
    const prayerEdit = document.querySelector('.prayer-edit');
    if (prayerEdit) {
        prayerEdit.addEventListener('click', handlePrayerEditClick);
    }
    
    // Initialize prayer row click handler
    const prayerRow = document.querySelector('.prayer-row');
    if (prayerRow) {
        prayerRow.addEventListener('click', handlePrayerRowClick);
    }
    
    // Initial render
    renderPrayerList();
    renderPraiseList();
});

function handlePrayerAction(e) {
    const target = e.target.closest('button');
    if (!target) return;
    
    const row = target.closest('tr');
    const prayerId = parseInt(row.dataset.id);
    
    if (target.classList.contains('prayer-archive')) {
        e.stopPropagation();
        const prayers = getPrayers();
        const prayer = prayers.find(p => p.id === prayerId);
        if (prayer) {
            prayer.is_archived = !prayer.is_archived;
            savePrayers(prayers);
            renderPrayerList();
        }
    } else if (target.classList.contains('prayer-remove')) {
        e.stopPropagation();
        if (confirm('Are you sure you want to remove this prayer?')) {
            const prayers = getPrayers();
            const updatedPrayers = prayers.filter(p => p.id !== prayerId);
            savePrayers(updatedPrayers);
            renderPrayerList();
        }
    }
}

function handlePraiseAction(e) {
    const target = e.target.closest('button');
    if (!target) return;
    
    const row = target.closest('tr');
    const praiseId = parseInt(row.dataset.id);
    
    if (target.classList.contains('praise-archive')) {
        e.stopPropagation();
        const praises = getPraises();
        const praise = praises.find(p => p.id === praiseId);
        if (praise) {
            praise.is_archived = !praise.is_archived;
            savePraises(praises);
            renderPraiseList();
        }
    } else if (target.classList.contains('praise-remove')) {
        e.stopPropagation();
        if (confirm('Are you sure you want to remove this praise?')) {
            const praises = getPraises();
            const updatedPraises = praises.filter(p => p.id !== praiseId);
            savePraises(updatedPraises);
            renderPraiseList();
        }
    }
}

function addPraise(praise) {
    const praises = getPraises();
    praises.push(praise);
    savePraises(praises);
}

function handleFollowupFormSubmit(e) {
    e.preventDefault();
    const followupDate = document.getElementById('followupDate').value;
    const followupNotes = document.getElementById('followupNotes').value.trim();
    
    if (prayerToFollowup) {
        const prayers = getPrayers();
        const prayer = prayers.find(p => p.id === prayerToFollowup);
        
        if (prayer) {
            const followup = {
                id: Date.now(),
                followup_at: formatDateForStorage(followupDate),
                followedup_at: new Date().toISOString(),
                notes: followupNotes
            };
            
            prayer.followups.push(followup);
            savePrayers(prayers);
            
            // Close the modal
            const followupModal = bootstrap.Modal.getInstance(document.getElementById('followupModal'));
            if (followupModal) {
                followupModal.hide();
            }
            
            // Reset the form
            e.target.reset();
            prayerToFollowup = null;
            
            // Refresh the prayer list
            renderPrayerList();
        }
    }
}

function handleFollowupDateClick(e) {
    e.stopPropagation();
    const cell = e.target.closest('td');
    if (!cell) return;
    
    const prayerId = parseInt(cell.dataset.id);
    prayerToFollowup = prayerId;
    
    const followupModalEl = document.getElementById('followupModal');
    if (followupModalEl) {
        const followupModal = new bootstrap.Modal(followupModalEl, {
            backdrop: true,
            keyboard: true,
            focus: true
        });
        followupModal.show();
    }
}

function handlePrayerAnsweredClick(e) {
    e.stopPropagation();
    const button = e.target.closest('button');
    if (!button) return;
    
    const row = button.closest('tr');
    const prayerId = parseInt(row.dataset.id);
    const prayers = getPrayers();
    const prayer = prayers.find(p => p.id === prayerId);
    
    if (prayer) {
        prayer.is_answered = !prayer.is_answered;
        savePrayers(prayers);
        renderPrayerList();
    }
}

function handlePrayerArchiveClick(e) {
    e.stopPropagation();
    const button = e.target.closest('button');
    if (!button) return;
    
    const row = button.closest('tr');
    const prayerId = parseInt(row.dataset.id);
    const prayers = getPrayers();
    const prayer = prayers.find(p => p.id === prayerId);
    
    if (prayer) {
        prayer.is_archived = !prayer.is_archived;
        savePrayers(prayers);
        renderPrayerList();
    }
}

function handlePrayerRemoveClick(e) {
    e.stopPropagation();
    const button = e.target.closest('button');
    if (!button) return;
    
    const row = button.closest('tr');
    const prayerId = parseInt(row.dataset.id);
    
    if (confirm('Are you sure you want to remove this prayer?')) {
        const prayers = getPrayers();
        const updatedPrayers = prayers.filter(p => p.id !== prayerId);
        savePrayers(updatedPrayers);
        renderPrayerList();
    }
}

function handlePrayerCalendarClick(e) {
    e.stopPropagation();
    const button = e.target.closest('button');
    if (!button) return;
    
    const row = button.closest('tr');
    const prayerId = parseInt(row.dataset.id);
    prayerToFollowup = prayerId;
    
    const followupModalEl = document.getElementById('followupModal');
    if (followupModalEl) {
        const followupModal = new bootstrap.Modal(followupModalEl, {
            backdrop: true,
            keyboard: true,
            focus: true
        });
        followupModal.show();
    }
}

function handlePrayerEditClick(e) {
    e.stopPropagation();
    const button = e.target.closest('button');
    if (!button) return;
    
    const row = button.closest('tr');
    const prayerId = parseInt(row.dataset.id);
    prayerToEdit = prayerId;
    
    const prayers = getPrayers();
    const prayer = prayers.find(p => p.id === prayerId);
    
    if (prayer) {
        document.getElementById('editPerson').value = prayer.person;
        const latestFollowup = prayer.followups[prayer.followups.length - 1];
        if (latestFollowup) {
            document.getElementById('editFollowupDate').value = latestFollowup.followup_at.split('T')[0];
        }
        
        const editPrayerModalEl = document.getElementById('editPrayerModal');
        if (editPrayerModalEl) {
            const editPrayerModal = new bootstrap.Modal(editPrayerModalEl, {
                backdrop: true,
                keyboard: true,
                focus: true
            });
            editPrayerModal.show();
        }
    }
}

function handlePrayerRowClick(e) {
    const row = e.target.closest('tr');
    if (!row) return;
    
    const prayerId = parseInt(row.dataset.id);
    const prayers = getPrayers();
    const prayer = prayers.find(p => p.id === prayerId);
    
    if (prayer) {
        const latestFollowup = prayer.followups[prayer.followups.length - 1];
        if (latestFollowup) {
            document.getElementById('followupDate').value = latestFollowup.followup_at.split('T')[0];
        }
        
        const followupModalEl = document.getElementById('followupModal');
        if (followupModalEl) {
            const followupModal = new bootstrap.Modal(followupModalEl, {
                backdrop: true,
                keyboard: true,
                focus: true
            });
            followupModal.show();
        }
    }
} 