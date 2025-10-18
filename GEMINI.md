# Gemini Code Style Guide

This document outlines the coding style, conventions, and architectural patterns used in this project, as derived from the existing codebase. Following these guidelines ensures consistency and maintainability.

## Backend (Node.js & TypeScript)

### 1. General Principles

-   **Language**: The project is written in **TypeScript**.
-   **Module System**: We use **ESM** (`import`/`export`). All relative imports **must** include the `.js` extension.
    ```typescript
    // Correct
    import ChangeJobUseCase from '../appUseCases/ChangeJobUseCase.js';

    // Incorrect
    import ChangeJobUseCase from '../appUseCases/ChangeJobUseCase';
    ```
-   **Architecture**: The backend follows principles of **Clean Architecture**. Logic is separated into distinct layers:
    -   **Domain**: Core business entities and rules (e.g., `User`, `Job`).
    -   **Application (Use Cases)**: Orchestrates business logic (e.g., `RegisterUserUseCase`).
    -   **Infrastructure**: Implements external concerns like databases, services, and security (e.g., `JobRepository`, `PasswordManager`).
    -   **Controllers**: Handles HTTP requests and responses, delegating to use cases.

### 2. File and Naming Conventions

-   **File Naming**: Files containing a single class or primary component are named in `PascalCase` (e.g., `JobController.ts`, `User.ts`).
-   **Test Files**: Test files are located in the `__tests__` directory, mirroring the `src` structure. They are named with the `.test.ts` suffix (e.g., `ChangeJobUseCase.test.ts`).
-   **Interfaces**: Interface names are prefixed with `I` (e.g., `IUserRepository`, `IJobRepository`).
-   **Variables and Functions**: Use `camelCase` (e.g., `registerUserUseCase`).
-   **Classes and Types**: Use `PascalCase` (e.g., `User`, `JobPayload`).
-   **Enums/Constants**: Use `PascalCase` for enum names and `UPPER_SNAKE_CASE` for enum members if applicable, though the current convention uses `PascalCase` for simple string enums (e.g., `JobStatus.PENDING`).

### 3. Class Design

-   **Dependency Injection**: Dependencies are injected via the constructor and declared as `private readonly`.

    ```typescript
    export default class JobController {
        constructor(
            private readonly jobRepository: IJobRepository,
            private readonly userRepository: IUserRepository
        ) {}
    }
    ```

-   **Use Cases**: Encapsulate a single business operation within a class with one public method, `execute`.

    ```typescript
    class RegisterUserUseCase {
        // ... constructor
        public async execute(request: RegisterUserRequest): Promise<User> {
            // ... logic
        }
    }
    ```

-   **Controllers**: Controller methods are defined as public arrow functions on the class instance. This ensures `this` is correctly bound.

    ```typescript
    export default class UserController {
        // ... constructor
        public register = async (req: Request, res: Response) => {
            // ... logic
        };
    }
    ```

-   **Domain Entities**: Entities contain their own validation logic, throwing an error if a rule is violated upon instantiation. Value Objects (e.g., `Email`, `EntityId`) are used to enforce constraints on specific attributes.

    ```typescript
    // In the User entity constructor
    if (!props.name) {
        throw new BadRequestError('name is required');
    }

    // Value Object usage
    const email = Email.create('test@example.com');
    ```

### 4. Testing with `vitest`

-   **Import Paths**: Always import the original TypeScript source files from the `src` directory in your test files. **Do not** import compiled JavaScript files from the `dist` directory. This is critical for ensuring accurate code coverage reporting.

    ```typescript
    // Correct
    import MyService from '../../src/services/MyService.js';

    // Incorrect
    import MyService from '../../dist/services/MyService.js';
    ```
-   **Structure**: Use `describe` to group tests for a class or function, and `it` to define individual test cases. Test descriptions should clearly state what the unit "should" do.
-   **Setup and Teardown**: Use `beforeEach` to reset mocks and initialize classes for a clean test environment. Always call `vi.clearAllMocks()` within `beforeEach`.
-   **Mocking**:
    -   Use `vi.mock('path/to/module.js')` to mock entire modules.
    -   Use `vi.fn()` to create mock functions for repository methods.
    -   Use `vi.spyOn()` to observe or modify methods on an existing object.
    -   Provide mock implementations using `(mockFn as vi.Mock).mockResolvedValue(...)`.

    ```typescript
    // Example from ChangeJobUseCase.test.ts
    const mockJobRepository: IJobRepository = {
        create: vi.fn(),
        update: vi.fn(),
        // ... other methods
    };

    beforeEach(() => {
        vi.clearAllMocks();
        changeJobUseCase = new ChangeJobUseCase(mockJobRepository, mockUserRepository);
    });

    it('should create a new job', async () => {
        (mockUserRepository.getById as vi.Mock).mockResolvedValue(user);
        (mockJobRepository.create as vi.Mock).mockImplementation(job => Promise.resolve(job));

        const result = await changeJobUseCase.execute(request);

        expect(mockJobRepository.create).toHaveBeenCalled();
    });
    ```

-   **Error Testing**: Test for expected errors using `expect(...).rejects.toThrow()`.

    ```typescript
    it('should throw UnauthorizedError if user does not own the job', async () => {
        // ... setup
        await expect(changeJobUseCase.execute(request)).rejects.toThrow(UnauthorizedError);
    });
    ```

### 5. Asynchronous Code

-   Always use `async/await` for asynchronous operations. All controller methods, use case `execute` methods, and repository methods that perform I/O are `async`.

### 6. Error Handling

-   Use custom error classes that extend `Error` (e.g., `NotFoundError`, `UnauthorizedError`, `BadRequestError`) to represent specific failure scenarios.
-   Business logic (use cases, domain) should throw these errors. The top-level error handling middleware is responsible for catching them and sending the appropriate HTTP response.

---

## Frontend (React & TypeScript)

### 1. Core Libraries & Stack

-   **Framework**: **React** with **TypeScript** (`.tsx`).
-   **Build Tool**: **Vite**.
-   **Routing**: **React Router**. The application uses the modern data-layer APIs (`createBrowserRouter`, `loader`, `action`).
-   **Styling**: **Styled Components**. A CSS-in-JS approach is used, with dedicated wrapper components for styling.
-   **Data Fetching**: **Axios** is used via a wrapper (`src/utils/ApiClient.ts`) primarily within React Router's `loader` and `action` functions.
-   **State Management**:
    -   **React Context**: For sharing UI state across a component tree (e.g., `DashboardContext`).
    -   **`useState`**: For local component state.
-   **UI Feedback**: **`react-toastify`** is used for displaying notifications.

### 2. Directory Structure

-   **`src/components`**: Contains reusable React components. A barrel file (`index.ts`) is used to export all components for simplified imports.
-   **`src/pages`**: Contains top-level page components. Each page and its related logic (loaders, actions, context) are organized into subdirectories (e.g., `src/pages/login`, `src/pages/dashboard`).
-   **`src/assets/wrappers`**: Contains all `styled-components` wrapper files. Each file is a `.ts` or `.js` file that exports a styled component.
-   **`src/utils`**: Contains shared utilities, constants, and the API client (e.g., `ApiClient.ts`, `Constants.ts`).

### 3. Component & Prop Styling

-   **Component Definition**: Components are defined as arrow functions and use the `.tsx` extension.

    ```tsx
    const AddJob = () => {
        // ... component logic
        return (
            <Wrapper>
                {/* ... JSX */}
            </Wrapper>
        );
    };
    export default AddJob;
    ```

-   **Prop Typing**: Component props are typed using inline object types directly in the function signature.

    ```tsx
    const FormRow = (options: {
        type: string;
        name: string;
        labelText?: string;
        defaultValue?: string;
    }) => {
        // ...
    };
    ```

### 4. Styling

-   **Styled Wrappers**: Components are styled using a dedicated `Wrapper` component created with `styled-components`. This wrapper is defined in a separate file under `src/assets/wrappers` and imported into the component.

    ```tsx
    // In src/pages/Landing.tsx
    import Wrapper from "../assets/wrappers/LandingPage";

    const Landing = () => {
      return (
        <Wrapper>
          {/* ... content ... */}
        </Wrapper>
      );
    };
    ```

-   **Global Styles**: Global styles and CSS variables (for colors, spacing, shadows, etc.) are defined in `src/index.css` and are used throughout the styled components.

    ```css
    /* In src/index.css */
    :root {
      --primary-500: #2cb1bc;
      --border-radius: 0.25rem;
    }
    ```

-   **Dynamic Styles**: Props are passed to styled-components to apply styles dynamically.

    ```typescript
    // In src/assets/wrappers/StatItem.ts
    const Wrapper = styled.article<{ bcg: string; color: string }>`
        border-bottom: 5px solid ${(props) => props.color};
        background: ${(props) => props.bcg};
    `;
    ```

### 5. Routing & Data Handling

-   **Centralized Configuration**: All routes are defined in `src/App.tsx` using `createBrowserRouter`.
-   **Loaders and Actions**:
    -   Data fetching for routes is handled by `loader` functions.
    -   Form submissions and data mutations are handled by `action` functions.
    -   These functions are typically co-located with the page component they serve (e.g., `src/pages/login/LoginAction.ts`).
    -   They use the `ApiClient` (axios instance) to communicate with the backend.

    ```typescript
    // In src/pages/login/LoginAction.ts
    const loginAction = async ({ request }: ActionFunctionArgs) => {
        const formData = await request.formData();
        const formFields = Object.fromEntries(formData);
        try {
            await apiClient.post("/auth/login", formFields);
            toast.success("Welcome!");
            return redirect("/dashboard");
        } catch (error) {
            // ... error handling
            return error;
        }
    };
    ```
-   **Form Handling**: The `<Form>` component from `react-router-dom` is used to trigger actions. The `useNavigation` hook is used to track the form's submission state for UI feedback (e.g., disabling buttons).

    ```tsx
    // In src/components/SubmitButton.tsx
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
    );
    ```

### 6. State Management

-   **React Context for UI State**: For state that needs to be shared across a layout or a significant part of the app (like user info, theme, or sidebar visibility), React Context is used.
-   **Custom Context Hook**: A custom hook (e.g., `useDashboardContext`) is always provided alongside the context to simplify its usage in consumer components.

    ```typescript
    // In src/pages/dashboard/DashboardContext.ts
    const DashboardContext = createContext(/* ... */);
    export const useDashboardContext = () => useContext(DashboardContext);

    // In a component
    import { useDashboardContext } from "../pages/dashboard/DashboardContext";
    const { user, toggleSidebar } = useDashboardContext();
    ```