const prompt = require('prompt-sync')();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Customer = require('./models/customer.js');

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
}
const disconnect = async () => {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit();
}
// creat a customer
const createCustomer = async () => {
    const name = prompt('Enter customer name:');
    const age = prompt('Enter customer age:')
    const customer = new Customer({ name, age});
    await customer.save();
    console.log(('Customer created:', customer));
}
// view all customer
const viewCustomers = async () => {
    const customers = await Customer.find({});
    customers.forEach(customer => {
        console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`);
    });
};
// update a customer
const updateCustomer = async () => {
    await viewCustomers();
    const id = prompt('Copy and paste the id of the customer you would like to update here:');
    const name = prompt('What is the customer new name?');
    const age = prompt('What is the cusmoter new age?');
    const updatedCustomer = await Customer.findByIdAndUpdate(id,{ name, age},{new:true});
    console.log('Updated customer:', updatedCustomer);
}
// delete a customer
const deleteCustomer = async () => {
    await viewCustomers()
    const id = prompt('Copy and paste the id of the customer you would like to delete here:');
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    console.log('Deleted customer:', deletedCustomer);
};

const main = async () => {
    await connect();
    while(true) {
        console.log(`
            Welcome to the CRM

            What would you like to do?
            
              1. Create a customer
              2. View all customers
              3. Update a customer
              4. Delete a customer
              5. Quit
        `   );
        const choice = prompt('Number of action to run: ');
        switch (choice) {
            case '1':
                await createCustomer();
                break;
            case '2':
                await viewCustomers();
                break;
            case '3':
                await updateCustomer();
                break;
            case '4':
                await deleteCustomer();
                break;
            case '5':
                console.log('Exiting...');
                await disconnect();
                break;
        }
    }
};

main();
