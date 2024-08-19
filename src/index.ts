
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});


interface Task {
    title: string;
    date: string;
    completed: boolean
}

function loadTasks(): void {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach((task:Task) => addTask(task));
}


const form = document.querySelector<HTMLFormElement>('#toDoForm')
const taskTitle = document.getElementById('taskTitle') as HTMLInputElement
const taskDate = document.getElementById('taskDueDate') as HTMLInputElement
const taskList = document.getElementById('taskList') as HTMLInputElement




form?.addEventListener('submit', (event) => {
    event.preventDefault();

    let titleError = document.getElementById('titleError') as HTMLInputElement
    let dateError = document.getElementById('dateError') as HTMLInputElement

    let isValid: boolean = true

    if(taskTitle?.value.trim() === '' ||taskTitle?.value.trim() === null){
        titleError.innerText = 'Field is required'
        isValid = false
    } else {
            titleError.innerText = ''
    }


    if(taskDate?.value === '' || taskDate?.value === null) {
        dateError.innerText = 'Field is required'
        isValid = false
    }else {

        let selectedDate: Date = new Date(taskDate.value)
        let currentDate: Date = new Date()

        selectedDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);   

        if(selectedDate < currentDate) {
            dateError.innerText = 'Date must be in the future'
            isValid = false
        } else {
            dateError.innerText = ''
        }
    }

    if(isValid) {
        const task: Task = {
            title: taskTitle.value,
            date: taskDate.value,
            completed: false
        }
        addTask(task)
        saveTask(task);
        form.reset();
    }

});


function addTask(task: Task) : void{
    const taskItem = document.createElement('div');
    taskItem.className = `task-item p-2 mb-2 bg-secondary border rounded d-flex align-items-center`

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.className = 'form-check-input me-2';
    checkBox.checked = task.completed;

    checkBox.addEventListener('change', () => {
        task.completed = checkBox.checked;
        console.log(checkBox.checked);
        updateTask(task)
    })

    const taskContent = document.createElement('div');
    taskContent.innerHTML = `<strong>${task.title}</strong><br><small>${task.date}</small>`;
    taskContent.className = 'flex-grow-1';


    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash-alt text-danger ms-2';
    deleteIcon.style.cursor = 'pointer';

    deleteIcon.addEventListener('click', () => {
        deteTask(task, taskItem);
    })

    taskItem.append(checkBox, taskContent, deleteIcon);
    taskList.append(taskItem);
}


function saveTask(task: Task) : void {
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function updateTask(updatedTask: Task): void {
    let tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = tasks.map((task) => task.title === updatedTask.title && task.date === updatedTask.date ? updatedTask : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deteTask(task: Task, taskItem: HTMLDivElement): void {

    taskItem.remove();

    let tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = tasks.filter((t) => t.title !== task.title || t.date !== task.date);
    localStorage.setItem('tasks', JSON.stringify(tasks));

}






