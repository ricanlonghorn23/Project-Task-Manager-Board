    // Retrieve tasks and nextId from localStorage
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

    // Function to generate a unique task id
    function generateTaskId() {
        return "task-" + nextId++;
    }
   // Function to generate a unique task id
   
   // Function to create a task card, render the task list and make cards draggable and droppable
   // Todo: create a function to create a task card
    function createTaskCard(task) {
        let card = $("<div>").addClass("card border-dark mb-3 draggable"); // Add 'draggable' class
        let cardHeader = $("<div>").addClass("card-header bg-light d-flex justify-content-between align-items-center").html(`<span class="fw-bold">${task.title}</span><span class="badge bg-primary">${task.dueDate}</span>`);
        
        let deleteButton = $("<button>").addClass("btn btn-danger btn-sm delete-task").html('<i class="fas fa-trash"></i>');
        deleteButton.click(function() {
            deleteTask(task.id);
        });
    
        cardHeader.append(deleteButton); 
        
        let cardBody = $("<div>").addClass("card-body").html(`<p class="card-text">${task.description}</p>`);      
        let cardContent = $("<div>").addClass("card-content").append(cardHeader, cardBody); 
        card.append(cardContent);
        return card;
    }
    // Todo: create a function to render the task list and make cards draggable
    function renderTaskList() {
        let todoContainer = $("#todo-cards");
        let inProgressContainer = $("#in-progress-cards");
        let doneContainer = $("#done-cards");
    
        todoContainer.empty();
        inProgressContainer.empty();
        doneContainer.empty();
    
        taskList.forEach(task => {
            let taskCard = createTaskCard(task);
            $("#" + task.status + "-cards").append(taskCard);
            $(taskCard).addClass(task.status);
            taskCard.draggable({
                revert: "invalid",
                containment: "document",
                helper: "clone",
                zIndex: 1000,
                start: function(_event, _ui) {
                    $(this).css("opacity", "0.5");
                },
                stop: function(_event, _ui) {
                    $(this).css("opacity", "1");
                }
            });
        taskCard.droppable({
        accept: ".draggable",
            drop: function(event, ui) {
                let newStatus = $(this).closest(".lane").attr("id");
                handleDrop(event, ui, newStatus);
     
            }
        });
    });
}
// Function to create a task card, render the task list and make cards draggable and droppable
    

// Todo: create a function to handle adding a new task
    function handleAddTask(event) {
        event.preventDefault();

        let taskTitle = $("#task-title").val();
        let taskDueDate = $("#datepicker").val();
        let taskDescription = $("#task-description").val();

        let newTask = {
            id: generateTaskId(),
            title: taskTitle,
            dueDate: taskDueDate,
            description: taskDescription,
            status: "todo"
        };

        taskList.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        localStorage.setItem("nextId", JSON.stringify(nextId));

        renderTaskList();

        $("#formModal").modal("hide");

        $("#task-title").val("");
        $("#datepicker").val("");
        $("#task-description").val("");
    }
// Todo: create a function to handle adding a new task

// Todo: create a function to handle deleting a task
    function deleteTask(taskId) {
    let taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }
}
// Todo: create a function to handle deleting a task
    

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(_event, ui, newStatus) {
    let taskId = ui.draggable.attr("id");
    let taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }
}
// Todo: create a function to handle dropping a task into a new status lane

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
    // Event listener for "Add Task" button
    $(document).ready(function () {
    $(".btn-success").on("click", function() {
        $("#formModal").modal("show");
    });

    // Event listener for "Save changes" button in modal
    $(".btn-primary").on("click", handleAddTask);
    
   
    });
   // Render the initial task list
    renderTaskList();