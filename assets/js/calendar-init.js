/**
 * Calendar Initialization for MR.DETAILER ERP
 * Custom event types: Bookings, Leads, Maintenance, Other
 */

(function() {
    'use strict';

    let calendar;
    let selectedEvent = {};
    let newEventData = null;

    // Sample events data (replace with actual data from backend)
    const defaultEvents = [
        {
            id: 1,
            title: 'Detailing Appointment - Honda City',
            start: new Date().toISOString().split('T')[0],
            className: 'bg-success-subtle',
            allDay: false,
            location: 'Crystal Studio, New Delhi',
            description: 'Full car detailing service'
        },
        {
            id: 2,
            title: 'Follow up with Lead',
            start: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            className: 'bg-secondary-subtle',
            allDay: true,
            location: 'Phone Call',
            description: 'Contact potential customer for PPF quote'
        }
    ];

    // Initialize calendar
    function initCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) {
            console.error('Calendar element not found');
            return;
        }

        calendar = new FullCalendar.Calendar(calendarEl, {
            timeZone: 'local',
            editable: true,
            droppable: true,
            selectable: true,
            initialView: 'dayGridMonth',
            themeSystem: 'bootstrap5',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },
            events: defaultEvents,
            eventClassNames: function(arg) {
                return [arg.event.extendedProps.className || arg.event.classNames || 'bg-primary-subtle'];
            },
            eventClick: function(info) {
                showEventDetails(info.event);
            },
            dateClick: function(info) {
                openNewEventModal(info.date);
            },
            eventDrop: function(info) {
                console.log('Event dropped:', info.event.title);
            }
        });

        calendar.render();
        updateUpcomingEvents();
    }

    // Show event details
    function showEventDetails(event) {
        document.getElementById('form-event').querySelector('.event-form').classList.add('d-none');
        document.getElementById('form-event').querySelector('.event-details').classList.remove('d-none');
        document.getElementById('btn-save-event').setAttribute('hidden', true);
        
        document.getElementById('modal-title').innerHTML = event.title;
        document.getElementById('event-start-date-tag').innerHTML = moment(event.start).format('DD MMM, YYYY');
        
        if (event.allDay) {
            document.getElementById('event-timepicker1-tag').innerHTML = 'Full';
            document.getElementById('event-timepicker2-tag').innerHTML = 'day event';
        } else {
            document.getElementById('event-timepicker1-tag').innerHTML = moment(event.start).format('hh:mm A');
            document.getElementById('event-timepicker2-tag').innerHTML = event.end ? moment(event.end).format('hh:mm A') : moment(event.start).format('hh:mm A');
        }
        
        document.getElementById('event-location-tag').innerHTML = event.extendedProps.location || '-';
        document.getElementById('event-description-tag').innerHTML = event.extendedProps.description || '-';
        
        selectedEvent = event;
        
        const modal = new bootstrap.Modal(document.getElementById('event-modal'));
        modal.show();
    }

    // Open new event modal
    function openNewEventModal(date) {
        document.getElementById('form-event').reset();
        document.getElementById('form-event').querySelector('.event-form').classList.remove('d-none');
        document.getElementById('form-event').querySelector('.event-details').classList.add('d-none');
        document.getElementById('btn-save-event').removeAttribute('hidden');
        document.getElementById('modal-title').innerHTML = 'Add New Event';
        document.getElementById('btn-save-event').innerHTML = 'Add Event';
        document.getElementById('btn-delete-event').setAttribute('hidden', true);
        document.getElementById('eventid').value = '';
        
        // Set default date
        if (date) {
            document.getElementById('event-start-date')._flatpickr.setDate(date);
        }
        
        newEventData = date;
        
        const modal = new bootstrap.Modal(document.getElementById('event-modal'));
        modal.show();
    }

    // Edit event
    window.editEvent = function(btn) {
        const form = document.getElementById('form-event');
        form.querySelector('.event-form').classList.remove('d-none');
        form.querySelector('.event-details').classList.add('d-none');
        document.getElementById('btn-save-event').removeAttribute('hidden');
        document.getElementById('btn-save-event').innerHTML = 'Update Event';
        document.getElementById('btn-delete-event').removeAttribute('hidden');
        
        // Populate form fields
        document.getElementById('event-title').value = selectedEvent.title;
        
        // Find the correct class name
        let className = 'bg-primary-subtle';
        if (selectedEvent.classNames && selectedEvent.classNames.length > 0) {
            className = selectedEvent.classNames[0];
        } else if (selectedEvent.extendedProps && selectedEvent.extendedProps.className) {
            className = selectedEvent.extendedProps.className;
        }
        document.getElementById('event-category').value = className;
        
        document.getElementById('event-location').value = selectedEvent.extendedProps.location || '';
        document.getElementById('event-description').value = selectedEvent.extendedProps.description || '';
        document.getElementById('eventid').value = selectedEvent.id;
        
        // Set date
        if (selectedEvent.start) {
            document.getElementById('event-start-date')._flatpickr.setDate(selectedEvent.start);
        }
    };

    // Update upcoming events list
    function updateUpcomingEvents() {
        if (!calendar) return;
        
        const events = calendar.getEvents();
        const upcomingList = document.getElementById('upcoming-event-list');
        if (!upcomingList) return;

        const now = new Date();
        const upcomingEvents = events
            .filter(event => new Date(event.start) >= now)
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 10);

        if (upcomingEvents.length === 0) {
            upcomingList.innerHTML = '<div class="text-center text-muted py-4">No upcoming events</div>';
            return;
        }

        upcomingList.innerHTML = upcomingEvents.map(event => {
            const startDate = moment(event.start).format('D MMM YYYY');
            const endDate = event.end ? moment(event.end).format('D MMM YYYY') : null;
            const dateText = endDate && endDate !== startDate ? `${startDate} to ${endDate}` : startDate;
            
            const timeText = event.allDay ? 'Full day event' : 
                `${moment(event.start).format('h:mm A')} to ${event.end ? moment(event.end).format('h:mm A') : '12:00 AM'}`;
            
            // Get color class
            let colorClass = 'primary';
            const className = event.classNames[0] || event.extendedProps.className || '';
            if (className.includes('success')) colorClass = 'success';
            else if (className.includes('secondary')) colorClass = 'secondary';
            else if (className.includes('warning')) colorClass = 'warning';
            else if (className.includes('danger')) colorClass = 'danger';
            else if (className.includes('info')) colorClass = 'info';
            
            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex mb-3">
                            <div class="flex-grow-1">
                                <i class="mdi mdi-checkbox-blank-circle me-2 text-${colorClass}"></i>
                                <span class="fw-medium">${dateText}</span>
                            </div>
                            <div class="flex-shrink-0">
                                <small class="badge bg-primary-subtle text-primary ms-auto">${timeText}</small>
                            </div>
                        </div>
                        <h6 class="card-title fs-16">${event.title}</h6>
                        <p class="text-muted text-truncate-two-lines mb-0">${event.extendedProps.description || ''}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize calendar
        initCalendar();

        // Initialize flatpickr for date selection
        const startDatePicker = flatpickr("#event-start-date", {
            mode: 'range',
            dateFormat: "Y-m-d",
            onChange: function(selectedDates) {
                if (selectedDates.length > 1) {
                    // Hide time inputs for multi-day events
                    document.getElementById('event-time').style.display = 'none';
                } else {
                    document.getElementById('event-time').style.display = 'block';
                }
            }
        });

        // Initialize flatpickr for time selection
        flatpickr("#timepicker1", {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: false
        });

        flatpickr("#timepicker2", {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: false
        });

        // Add new event button
        const btnNewEvent = document.getElementById('btn-new-event');
        if (btnNewEvent) {
            btnNewEvent.addEventListener('click', function() {
                openNewEventModal(new Date());
            });
        }

        // Form validation and submission
        const form = document.getElementById('form-event');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (form.checkValidity() === false) {
                    form.classList.add('was-validated');
                    return;
                }

                const title = document.getElementById('event-title').value;
                const category = document.getElementById('event-category').value;
                const location = document.getElementById('event-location').value;
                const description = document.getElementById('event-description').value;
                const startDate = document.getElementById('event-start-date').value;
                const startTime = document.getElementById('timepicker1').value;
                const endTime = document.getElementById('timepicker2').value;
                const eventId = document.getElementById('eventid').value;

                if (!title || !category || !startDate) {
                    alert('Please fill in all required fields');
                    return;
                }

                const eventData = {
                    title: title,
                    start: startDate,
                    className: category,
                    allDay: !startTime,
                    location: location,
                    description: description
                };

                if (startTime) {
                    eventData.start = `${startDate.split(' to ')[0]}T${startTime}`;
                    eventData.allDay = false;
                    if (endTime) {
                        eventData.end = `${startDate.split(' to ')[0]}T${endTime}`;
                    }
                }

                if (eventId) {
                    // Update existing event
                    const event = calendar.getEventById(eventId);
                    if (event) {
                        event.setProp('title', title);
                        event.setStart(eventData.start);
                        event.setProp('classNames', [category]);
                        event.setExtendedProp('location', location);
                        event.setExtendedProp('description', description);
                        event.setExtendedProp('className', category);
                        event.setAllDay(eventData.allDay);
                        if (eventData.end) {
                            event.setEnd(eventData.end);
                        }
                    }
                } else {
                    // Add new event
                    calendar.addEvent(eventData);
                }

                updateUpcomingEvents();
                bootstrap.Modal.getInstance(document.getElementById('event-modal')).hide();
                form.classList.remove('was-validated');
                form.reset();
            });
        }

        // Delete event
        const btnDelete = document.getElementById('btn-delete-event');
        if (btnDelete) {
            btnDelete.addEventListener('click', function() {
                if (selectedEvent) {
                    selectedEvent.remove();
                    updateUpcomingEvents();
                    bootstrap.Modal.getInstance(document.getElementById('event-modal')).hide();
                }
            });
        }

        // Make external events draggable
        const draggableEl = document.getElementById('external-events');
        if (draggableEl && typeof FullCalendar.Draggable !== 'undefined') {
            new FullCalendar.Draggable(draggableEl, {
                itemSelector: '.external-event',
                eventData: function(eventEl) {
                    return {
                        title: eventEl.innerText.trim(),
                        className: eventEl.getAttribute('data-class'),
                        create: true
                    };
                }
            });
        }
    });

    // Expose update function globally
    window.updateCalendarEvents = function(events) {
        if (calendar) {
            calendar.removeAllEvents();
            calendar.addEventSource(events);
            updateUpcomingEvents();
        }
    };

})();
