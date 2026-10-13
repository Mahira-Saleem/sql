// Supabase Configuration
const supabaseUrl = 'https://znubayscztsrerushofz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudWJheXNjenRzcmVydXNob2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MjA4NTcsImV4cCI6MjEwNzA5Njg1N30.PN6JC8Kq1zNF58ZqmkjbTehnR5gjcBeq19gajPIiO5c';

const supa_base = window.supabase.createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentTableBody');
const studentIdInput = document.getElementById('studentId');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

// 1. Fetch & Display Students
async function getStudents() {
  const { data, error } = await supa_base.from('std').select('*').order('id', { ascending: true });
  
  if (error) {
    alert('Error fetching data: ' + error.message);
    return;
  }
  
  tableBody.innerHTML = '';
  
  if (!data || data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-gray-500">Koi student mojood nahi hai.</td></tr>`;
    return;
  }

  data.forEach(student => {
    tableBody.innerHTML += `
      <tr class="border-b hover:bg-gray-50">
        <td class="py-2 px-4 border text-gray-800">${escapeHtml(student.name)}</td>
        <td class="py-2 px-4 border text-gray-800">${escapeHtml(student.email)}</td>
        <td class="py-2 px-4 border text-gray-800">${escapeHtml(student.course)}</td>
        <td class="py-2 px-4 border text-center space-x-1">
          <button onclick="editStudent(${student.id}, '${escapeHtml(student.name)}', '${escapeHtml(student.email)}', '${escapeHtml(student.course)}')" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">Edit</button>
          <button onclick="deleteStudent(${student.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
        </td>
      </tr>
    `;
  });
}

// 2. Insert or Update Student Form Event
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = studentIdInput.value;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const course = document.getElementById('course').value.trim();

  if (id) {
    // Update existing student
    const { error } = await supa_base.from('std').update({ name, email, course }).eq('id', id);
    if (error) {
      alert('Update error: ' + error.message);
      return;
    }
    alert('Student Updated Successfully!');
  } else {
    // Insert new student
    const { error } = await supa_base.from('std').insert([{ name, email, course }]);
    if (error) {
      alert('Insert error: ' + error.message);
      return;
    }
    alert('Student Added Successfully!');
  }

  resetForm();
  getStudents();
});

// 3. Populate Form for Editing
window.editStudent = (id, name, email, course) => {
  studentIdInput.value = id;
  document.getElementById('name').value = name;
  document.getElementById('email').value = email;
  document.getElementById('course').value = course;
  
  submitBtn.textContent = 'Update Student';
  submitBtn.className = 'bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded';
  cancelBtn.classList.remove('hidden');
};

// Reset Form Helper
window.resetForm = () => {
  form.reset();
  studentIdInput.value = '';
  submitBtn.textContent = 'Add Student';
  submitBtn.className = 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded';
  cancelBtn.classList.add('hidden');
};

// 4. Delete Student
window.deleteStudent = async (id) => {
  if (confirm('Kya aap waqai is student ko delete karna chahte hain?')) {
    const { error } = await supa_base.from('std').delete().eq('id', id);
    if (error) {
      alert('Delete error: ' + error.message);
      return;
    }
    alert('Student Deleted Successfully!');
    getStudents();
  }
};

// Security helper to prevent XSS injection
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Initial Data Load
getStudents();