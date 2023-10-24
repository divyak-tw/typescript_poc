// autoBind decorator
function autoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        }
    }
    return adjDescriptor;
}

//Validation
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatable : Validatable) {
    let isValid = true;
    if (validatable.required) {
        isValid = isValid && validatable.value.toString().trim().length !== 0;
    }
    if (validatable.minLength != null && typeof validatable.value == 'string') {
        isValid = isValid && validatable.value.trim().length >= validatable.minLength;
    }
    if (validatable.maxLength != null && typeof validatable.value == 'string') {
        isValid = isValid && validatable.value.trim().length <= validatable.maxLength;
    }
    if (validatable.min != null && typeof validatable.value == 'number') {
        isValid = isValid && validatable.value >= validatable.min;
    }
    if (validatable.max != null && typeof validatable.value == 'number') {
        isValid = isValid && validatable.value <= validatable.max;
    }
    return isValid;
}

//Project Input class
class ProjectInput {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable : Validatable = {
            value: enteredTitle,
            required: true
        };

        const descriptorValidatable : Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };

        const peopleValidatable : Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5,
        };

        if (!validate(titleValidatable) || !validate(descriptorValidatable) || !validate(peopleValidatable)) {
            alert('Invalid input');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @autoBind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
            this.clearInputs();
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const project = new ProjectInput();