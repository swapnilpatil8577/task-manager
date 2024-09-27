import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Input from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';


const Task = () => {

    const authState = useSelector(state => state.authReducer);
    const navigate = useNavigate();
    const [fetchData, { loading }] = useFetch();
    const { taskId } = useParams();

    const mode = taskId === undefined ? "add" : "update";
    const [task, setTask] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        status: "New" // Default status
    });

    const [formErrors, setFormErrors] = useState({});


    useEffect(() => {
        document.title = mode === "add" ? "Add task" : "Update Task";
    }, [mode]);


    useEffect(() => {
        if (mode === "update") {
            const config = {
                url: `/tasks/${taskId}`, method: "get",
                headers: { Authorization: authState.token }
            };
            fetchData(config, { showSuccessToast: false })
                .then((data) => {
                    setTask(data.task);
                    if (data.task) {
                        setFormData({ 
                            title: data.task.title, 
                            description: data.task.description, 
                            dueDate: data.task.dueDate,
                            status: data.task.status || "New" // Set status from fetched data or default
                        });
                    } else {
                        console.error('Task data not found'); 
                    }
                });
        }
    }, [mode, authState, taskId, fetchData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'dueDate') {
          // Get today's date
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
    
          // Convert selected date to Date object
          const selectedDate = new Date(value);
    
          // Allow only current or future dates
          if (selectedDate < today) {
            return; // Don't update formData if the date is in the past
          }
        }
    
        setFormData({
          ...formData,
          [name]: value,
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateManyFields("task", formData);
        setFormErrors({});

        if (errors.length > 0) {
            setFormErrors(errors.reduce((total, ob) =>
                ({ ...total, [ob.field]: ob.err }), {}));
            return;
        }

        if (mode === "add") {
            const config = {
                url: "/tasks", method: "post",
                data: formData, headers: { Authorization: authState.token }
            };
            fetchData(config).then(() => {
                navigate("/");
            });
        }
        else {
            const config = {
                url: `/tasks/${taskId}`, method: "put",
                data: formData, headers: { Authorization: authState.token }
            };
            fetchData(config).then(() => {
                navigate("/");
            });
        }
    }


    const fieldError = (field) => (
        <p className={`mt-1 text-pink-600 text-sm 
    ${formErrors[field] ? "block" : "hidden"}`}>
            <i className='mr-2 fa-solid fa-circle-exclamation'></i>
            {formErrors[field]}
        </p>
    )
    
    return (
        <>
            <MainLayout>
                <form className='m-auto my-16 max-w-[1000px] 
        bg-white p-8 border-2 shadow-md rounded-md'>
                    {loading ? (
                        <Loader />
                    ) : (
                        <> 
                            <h2 className='text-center font-semibold mb-4'>{mode === "add" ?
                                "Add New Task" : "Edit Task"}</h2>
                            <div className="mb-4">
                                <label htmlFor="title" className="after:content-['*']
                after:ml-0.5 after:text-red-500">Title</label>
                                <Input type="text" name="title" id="title"
                                    value={formData.title} placeholder="Title"
                                    onChange={handleChange} />
                                {fieldError("title")}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description">Description</label>
                                <Textarea type="description" name="description"
                                    id="description" value={formData.description} placeholder="Write here.."
                                    onChange={handleChange} />
                                {fieldError("description")}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="dueDate" className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Due Date
                                </label>
                                <Input
                                    type="date"
                                    name="dueDate"
                                    id="dueDate"
                                    className=''
                                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                                    placeholder="Due date"
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]} // Set min attribute to today's date
                                />
                                {fieldError('dueDate')}
                            </div>
                            <div className="mb-4"> {/* New Status dropdown */}
                                <label htmlFor="status" className="after:content-['*']
                after:ml-0.5 after:text-red-500">Status</label>
                                <select 
                                    name="status" 
                                    id="status" 
                                    className="block w-full mt-2 px-3 py-2 text-gray-600 rounded-[4px] border-2 border-gray-100 focus:border-purple-400 transition outline-none hover:border-gray-300"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="New">New</option>
                                    <option value="Inprogress">Inprogress</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <button className='bg-purple-400 text-white px-4 py-2 font-medium rounded-sm hover:bg-purple-500'
                                onClick={handleSubmit}>{mode === "add" ? "Add" : "Update"}</button>
                            <button className='ml-4 bg-red-500 hover:bg-red-600 rounded-sm text-white px-4 py-2 font-medium'
                                onClick={() => navigate("/")}>Cancel</button>
                        </>
                    )}
                </form>
            </MainLayout>
        </>
    )
}

export default Task