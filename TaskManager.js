export default class TaskManager {
    constructor() {
        this.taskArray = [];
    }

    getAllTasks() {
        return this.taskArray;
    }
    
    addTask(task) {
        this.taskArray.push(task);
    }

    updateStatus(id,value){
        let targetTask = this.taskArray.find(task => task.taskID === id);
        targetTask.status = value;
    }  

    getTasksWithStatus(status) {
        const tasksWithMatchedStatus = [];
        for (let task of this.taskArray) {
            if (task.status === status) {
                tasksWithMatchedStatus.push(task);
            }
        }
        return tasksWithMatchedStatus;
    }

    render(newTask) {
        const divPanel = document.createElement('div');
        divPanel.classList.add('card');
        divPanel.innerHTML = newTask;
        const taskPanel = document.getElementById('display-cards');
        taskPanel.appendChild(divPanel);
    }
}