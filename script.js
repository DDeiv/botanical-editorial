const weeklyTasks = [
    { id: 'w1', text: 'Hydration Assessment', sub: 'Manual moisture check on top 2 inches. Exclude Aloe and Jade.' },
    { id: 'w2', text: 'Reservoir Protocol', sub: 'Verify Papyrus "Beppe" remains in standing water.' },
    { id: 'w3', text: 'Foliage Audit', sub: 'Check Calathea and Begonia undersides for signs of pests.' },
    { id: 'w4', text: 'Distilled Diet', sub: 'Ensure Calathea "Carlotta" gets flush with pure distilled water.' },
    { id: 'w5', text: 'Drainage Clear', sub: 'Empty catch pots completely to deter root suffocation.' },
    { id: 'w6', text: 'Symmetry Rotation', sub: 'Turn Jade and Aloe 90-degrees against the light source.' }
];

const monthlyTasks = [
    { id: 'm1', text: 'Particulate Removal', sub: 'Damp wipe Dracaenas and Monstera to clear stomata dust.' },
    { id: 'm2', text: 'Deep Soak Intervention', sub: 'Fully submerge ZZ Plant, Jade, and Aloe pots; drain entirely.' },
    { id: 'm3', text: 'Chemical Flush', sub: 'Irrigate Dracaena "Pino" with distilled water to remove fluoride.' },
    { id: 'm4', text: 'Structural Audit', sub: 'Check Monstera node attachments and moss pole moisture.' }
];

// Helpers for date tracking
function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return d.getUTCFullYear() + '-' + weekNo;
}

function getMonthString(d) {
    return d.getFullYear() + '-' + d.getMonth();
}

function initChecklists() {
    const weeklyContainer = document.getElementById('weekly-checklist');
    const monthlyContainer = document.getElementById('monthly-checklist');
    
    // Determine Time Frames
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const currentMonth = getMonthString(now);

    // Check Weekly resets
    const lastWeek = localStorage.getItem('botanica_last_week');
    if (lastWeek !== currentWeek) {
        // Reset weekly state
        weeklyTasks.forEach(t => localStorage.setItem('botanica_' + t.id, 'false'));
        localStorage.setItem('botanica_last_week', currentWeek);
    }

    // Check Monthly resets
    const lastMonth = localStorage.getItem('botanica_last_month');
    if (lastMonth !== currentMonth) {
        // Reset monthly state
        monthlyTasks.forEach(t => localStorage.setItem('botanica_' + t.id, 'false'));
        localStorage.setItem('botanica_last_month', currentMonth);
    }

    // Render Weekly
    renderList(weeklyTasks, weeklyContainer, 'weekly');
    // Render Monthly
    renderList(monthlyTasks, monthlyContainer, 'monthly');
}

function renderList(tasks, container, type) {
    container.innerHTML = '';
    
    tasks.forEach(task => {
        const isDone = localStorage.getItem('botanica_' + task.id) === 'true';
        
        const itemBody = document.createElement('div');
        itemBody.className = `check-item flex items-start gap-4 p-4 rounded-lg border border-outline-variant/30 bg-surface-container-lowest ${isDone ? 'done' : ''}`;
        itemBody.onclick = () => toggleTask(task.id, itemBody, type, tasks.length);

        const checkbox = document.createElement('div');
        checkbox.className = 'check-box w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5';

        const textContainer = document.createElement('div');
        textContainer.className = 'flex-1 select-none';
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'check-text block text-sm font-bold text-primary leading-snug';
        titleSpan.innerText = task.text;

        const subSpan = document.createElement('span');
        subSpan.className = 'block text-xs text-on-surface-variant mt-1 font-label';
        subSpan.innerText = task.sub;

        textContainer.appendChild(titleSpan);
        textContainer.appendChild(subSpan);

        itemBody.appendChild(checkbox);
        itemBody.appendChild(textContainer);
        container.appendChild(itemBody);
    });

    updateCounters(type, tasks.length);
}

function toggleTask(id, element, type, total) {
    const isDone = element.classList.contains('done');
    element.classList.toggle('done');
    localStorage.setItem('botanica_' + id, !isDone);
    
    updateCounters(type, total);
}

function updateCounters(type, total) {
    let completed = 0;
    const taskIds = type === 'weekly' ? weeklyTasks.map(t=>t.id) : monthlyTasks.map(t=>t.id);
    
    taskIds.forEach(id => {
        if (localStorage.getItem('botanica_' + id) === 'true') {
            completed++;
        }
    });

    const badge = document.getElementById(`${type}-status`);
    badge.innerText = `${completed} / ${total}`;
    
    if (completed === total) {
        badge.classList.add(type === 'weekly' ? 'bg-primary' : 'bg-secondary');
        badge.classList.remove('bg-primary/10', 'bg-secondary/20', 'text-primary', 'text-[#116c4a]');
        badge.classList.add('text-white');
    } else {
        badge.classList.remove('bg-primary', 'bg-secondary', 'text-white');
        if(type === 'weekly') {
            badge.classList.add('bg-primary/10', 'text-primary');
        } else {
            badge.classList.add('bg-secondary/20', 'text-[#116c4a]');
        }
    }
}

document.addEventListener('DOMContentLoaded', initChecklists);
