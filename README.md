# Rapid Aid Matcher - Frontend

A React-based frontend for the Rapid Aid Matcher disaster relief application. This application allows users to submit aid requests and responders to view and coordinate relief efforts.

## Features

- **Submit Aid Requests**: Users can submit requests with their location and aid needs
- **Responder Dashboard**: View categorized aid requests with filtering and sorting options
- **AI-Powered Categorization**: Backend AI categorizes requests (Food, Water, Shelter, Medical, Other)
- **Mobile-Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean Component Architecture**: Reusable, maintainable React components

## Technology Stack

- **Framework**: React 18 with functional components and hooks
- **Routing**: React Router v6
- **Styling**: Plain CSS with CSS Modules approach
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.js         # Navigation header
│   ├── Header.css
│   ├── RequestForm.js    # Aid request submission form
│   ├── RequestForm.css
│   ├── RequestList.js    # List of aid requests
│   ├── RequestList.css
│   ├── RequestCard.js    # Individual request display
│   ├── RequestCard.css
│   ├── CategoryBadge.js  # Category display badge
│   └── CategoryBadge.css
├── pages/                # Page components
│   ├── SubmitRequestPage.js    # Submit request page
│   ├── SubmitRequestPage.css
│   ├── DashboardPage.js        # Responder dashboard
│   └── DashboardPage.css
├── App.js                # Main app component
├── App.css
├── index.css             # Global styles
└── main.jsx              # App entry point
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Shellhacks_2025
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend is designed to work with a FastAPI backend. Update the API endpoints in the components:

### Expected API Endpoints

- `POST /api/requests` - Submit new aid request
- `GET /api/requests` - Fetch all aid requests (with optional filtering)

### Request Data Structure

```json
{
  "name": "John Doe (optional)",
  "location": "123 Main St, City, State",
  "request_text": "Need food and water for family of 4"
}
```

### Response Data Structure

```json
{
  "id": 1,
  "name": "John Doe",
  "location": "123 Main St, City, State",
  "request_text": "Need food and water for family of 4",
  "category": "food",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Component Documentation

### Header
Navigation component with links to Submit Request and Dashboard pages.

### RequestForm
Form component for submitting aid requests. Includes validation and loading states.

### RequestList
Displays list of requests with filtering by category and sorting options.

### RequestCard
Individual request display with category badges, timestamps, and contact information.

### CategoryBadge
Reusable badge component for displaying request categories with color coding:
- Food: Green
- Water: Blue
- Shelter: Purple
- Medical: Red
- Other: Gray

## Styling Approach

- Global styles in `index.css` for common elements (buttons, forms, containers)
- Component-specific CSS files for component styling
- Mobile-first responsive design using CSS Grid and Flexbox
- CSS custom properties for consistent colors and spacing

## Future Enhancements

- Map integration for location visualization
- Real-time updates using WebSockets
- User authentication and profiles
- Advanced filtering and search
- Multi-language support
- Offline support with service workers
- Push notifications for urgent requests

## Development Guidelines

1. **Component Organization**: Each component should have its own CSS file
2. **Responsive Design**: Test on mobile devices and use relative units
3. **Accessibility**: Include proper ARIA labels and semantic HTML
4. **Performance**: Lazy load components and optimize images
5. **Error Handling**: Implement proper error boundaries and user feedback

## Contributing

1. Follow the existing code style and component structure - Look at `RequestForm.jsx` and `DashboardPage.jsx`
2. Add CSS files for new components
3. Test responsive design on multiple screen sizes
4. Update documentation for new features

## Contributors

1. Alec Gomez - Frontend / DevOps
2. 
3. 
4. 
