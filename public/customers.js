document.addEventListener('DOMContentLoaded', () => {
    const customerForm = document.getElementById('customer-form');
    const editCustomerForm = document.getElementById('edit-customer-form');
    const customersTableBody = document.querySelector('#customersTbl tbody');
    const modal = document.getElementById('custModal');
    
    let allCustomers = [];
    let editingId = null;

    const API_URL = '/api/customers';

    const loadCustomers = async () => {
        try {
            const response = await fetch(API_URL);
            allCustomers = await response.json();
            renderTable(allCustomers);
        } catch (error) {
            console.error('Müştəriləri yükləyərkən xəta:', error);
        }
    };

    const renderTable = (customers) => {
        customersTableBody.innerHTML = '';
        customers.forEach(customer => {
            const row = customersTableBody.insertRow();
            row.innerHTML = `
                <td>${customer.firstName} ${customer.lastName}</td>
                <td>${customer.phone || ''}</td>
                <td>${customer.email || ''}</td>
                <td>
                    ${customer.idCardPath 
                        ? `<a href="/api/document/${customer.idCardPath}" target="_blank" class="btn">Yüklə</a>` 
                        : '-'}
                </td>
                <td>
                    <button class="btn edit-btn" data-id="${customer.id}">Redaktə</button>
                    <button class="btn btn-danger delete-btn" data-id="${customer.id}">Sil</button>
                </td>
            `;
        });
    };

    customerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(customerForm);
        try {
            const response = await fetch(API_URL, { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Müştəri əlavə edilmədi');
            customerForm.reset();
            await loadCustomers();
        } catch (error) {
            console.error('Xəta:', error);
            alert('Müştəri əlavə edilərkən xəta baş verdi.');
        }
    });

    editCustomerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!editingId) return;

        const formData = new FormData(editCustomerForm);
        try {
            const response = await fetch(`${API_URL}/${editingId}`, { method: 'PATCH', body: formData });
            if (!response.ok) throw new Error('Müştəri məlumatları yenilənmədi');
            closeEditModal();
            await loadCustomers();
        } catch (error) {
            console.error('Yeniləmə xətası:', error);
            alert('Müştəri yenilənərkən xəta baş verdi.');
        }
    });

    customersTableBody.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('delete-btn')) {
            const id = target.dataset.id;
            if (confirm('Bu müştərini silməyə əminsinizmi?')) {
                fetch(`${API_URL}/${id}`, { method: 'DELETE' })
                    .then(res => {
                        if (!res.ok) throw new Error('Silmə əməliyyatı uğursuz oldu');
                        loadCustomers();
                    })
                    .catch(err => alert(err.message));
            }
        } else if (target.classList.contains('edit-btn')) {
            const id = target.dataset.id;
            const customer = allCustomers.find(c => c.id === id);
            openEditModal(customer);
        }
    });

    const openEditModal = (customer) => {
        editingId = customer.id;
        editCustomerForm.querySelector('#eFirst').value = customer.firstName || '';
        editCustomerForm.querySelector('#eLast').value = customer.lastName || '';
        editCustomerForm.querySelector('#ePhone').value = customer.phone || '';
        editCustomerForm.querySelector('#eEmail').value = customer.email || '';
        editCustomerForm.querySelector('#eIdCard').value = ''; // Fayl inputunu təmizlə
        modal.classList.add('show');
    };

    const closeEditModal = () => {
        editingId = null;
        modal.classList.remove('show');
    };

    modal.querySelector('#eClose').addEventListener('click', closeEditModal);

    loadCustomers();
});