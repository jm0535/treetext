// Script to set up Jimmy Moses as administrator and configure RLS
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials from the project
const supabaseUrl = 'https://zsronpdhtzzasrwawjto.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzcm9ucGRodHp6YXNyd2F3anRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODU0NDAsImV4cCI6MjA1OTY2MTQ0MH0.0XQUR7QHbZP0p10a4uZ4o0Tuk4YPPBJrcUu-qVAVpBM';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client with service role key (needed for admin operations)
const supabase = createClient(supabaseUrl, serviceRoleKey || supabaseKey);

async function setupAdminUser() {
  try {
    console.log('Setting up Jimmy Moses as administrator...');
    
    // 1. Check if the user exists
    const { data: existingUsers, error: userError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', 'jimmy.moses@pnguot.ac.pg')
      .single();
    
    if (userError) {
      console.log('Error checking for existing user:', userError.message);
      console.log('Creating new admin user...');
      
      // 2. If user doesn't exist, create a new user with admin role
      const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
        email: 'jimmy.moses@pnguot.ac.pg',
        password: 'temporary-password', // This should be changed after first login
        email_confirm: true,
        user_metadata: { role: 'admin' }
      });
      
      if (signUpError) {
        console.error('Error creating admin user:', signUpError.message);
        return;
      }
      
      console.log('Admin user created successfully:', newUser);
    } else {
      console.log('User already exists, updating role to admin...');
      
      // 3. If user exists, update their role to admin
      const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUsers.id,
        { user_metadata: { role: 'admin' } }
      );
      
      if (updateError) {
        console.error('Error updating user role:', updateError.message);
        return;
      }
      
      console.log('User role updated successfully:', updatedUser);
    }
    
    // 4. Set up RLS policies for all relevant tables
    console.log('Setting up Row Level Security policies...');
    
    // Get list of tables to apply RLS to
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError.message);
      return;
    }
    
    // Enable RLS and create policies for each table
    for (const table of tables) {
      const tableName = table.table_name;
      
      // Skip system tables
      if (tableName.startsWith('_') || tableName === 'schema_migrations') {
        continue;
      }
      
      console.log(`Setting up RLS for table: ${tableName}`);
      
      // Enable RLS on the table
      await supabase.rpc('enable_rls', { table_name: tableName });
      
      // Create admin policy (full access)
      await supabase.rpc('create_policy', {
        table_name: tableName,
        policy_name: `Admin users have full access to ${tableName}`,
        definition: `auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')`,
        check_definition: `auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')`,
        policy_operation: 'ALL'
      });
      
      // Create regular user policy (read-only or filtered access depending on table)
      await supabase.rpc('create_policy', {
        table_name: tableName,
        policy_name: `Regular users have restricted access to ${tableName}`,
        definition: `auth.uid() IS NOT NULL`,
        check_definition: `auth.uid() IS NOT NULL`,
        policy_operation: 'SELECT'
      });
      
      console.log(`RLS policies created for table: ${tableName}`);
    }
    
    console.log('Setup completed successfully!');
    
  } catch (error) {
    console.error('Unexpected error during setup:', error.message);
  }
}

// Run the setup
setupAdminUser();
