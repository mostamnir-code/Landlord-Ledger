// In a real project, you would import this from the library
// import { createClient } from '@supabase/supabase-js';
const { createClient } = (window as any).supabase;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  const errorMessage = "Supabase URL and Anon Key are not set. Please add SUPABASE_URL and SUPABASE_KEY to your environment variables.";
  console.error(errorMessage);
  // In a real app, you might want to show this to the user in the UI
  // For this environment, we'll throw an error to make it clear during development.
  // Note: This check will run when the module is imported.
  // A better approach for UI feedback would be to check this in the App root component.
  if (document.getElementById('root')) {
    document.getElementById('root')!.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: sans-serif; background-color: #FFFBEB; color: #92400E; border: 1px solid #FBBF24; border-radius: 0.5rem; margin: 2rem;">
        <h1 style="font-size: 1.5rem; font-weight: bold;">Configuration Error</h1>
        <p>${errorMessage}</p>
        <p>The application cannot start without these values.</p>
      </div>
    `;
  }
  throw new Error(errorMessage);
}


export const supabase = createClient(supabaseUrl, supabaseKey);
