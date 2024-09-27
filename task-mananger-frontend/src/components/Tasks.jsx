import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Tooltip from './utils/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const Tasks = () => {

    const authState = useSelector(state =>
        state.authReducer);
    const [tasks, setTasks] = useState([]);
    const [fetchData] = useFetch();

    const fetchTasks = useCallback(() => {
        const config = {
            url: "/tasks", method: "get",
            headers: { Authorization: authState.token }
        };
        fetchData(config, { showSuccessToast: false })
            .then(data => setTasks(data.tasks));
    }, [authState.token, fetchData]);

    useEffect(() => {
        if (!authState.isLoggedIn) return;
        fetchTasks();
    }, [authState.isLoggedIn, fetchTasks]);


    const handleDelete = (id) => {
        const config = {
            url: `/tasks/${id}`,
            method: "delete", headers: { Authorization: authState.token }
        };
        fetchData(config)
            .then(() => fetchTasks());
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'New':
                return 'bg-gray-200'; // Light grey for 'New'
            case 'Pending':
                return 'bg-yellow-200'; // Yellow for 'Pending'
            case 'Inprogress':
                return 'bg-blue-200'; // Blue for 'Inprogress'
            case 'Completed':
                return 'bg-green-200'; // Green for 'Completed'
            default:
                return ''; // Default color if no match
        }
    };

    return (
        <>
            <div className="my-2 mx-auto max-w-[1200px] py-4">

                { tasks.length === 0 ? (
                    <div className='w-[600px] h-[300px] 
                    flex items-center justify-center gap-4'>
                        <span>No tasks found</span>
                        <Link to="/tasks/add" className="bg-purple-500
                    text-white hover:bg-purple-600 font-semibold 
                    rounded-md px-4 py-2">+ Add new task </Link>
                    </div>
                ): (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Task Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Description
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Due Date
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3"> {/* New Status column */}
                                    <div className="flex items-center">
                                        Status
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Actions
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            tasks.toReversed().map((task, index) => (
                                <tr key={task._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {task.title}
                                    </th>
                                    <td className="px-6 py-4">
                                        {task.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        {
                                            new Date(task.dueDate).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            })
                                        }
                                    </td>
                                    <td className='px-6 py-4'> {/* Status column content */}
                                        <span className={`px-6 py-2 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>{task.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Tooltip  text={"Edit"} position={"top"}>
                                            <Link to={`/tasks/${task._id}`} className='ml-auto mr-2 text-purple-600 cursor-pointer'>
                                                <FontAwesomeIcon icon={faPen} /> 
                                            </Link>
                                        </Tooltip>

                                        <Tooltip text={"Delete"} position={"top"}>
                                            <span className='text-red-500 cursor-pointer px-4' onClick={() => handleDelete(task._id)}>
                                                <FontAwesomeIcon icon={faTrash} /> 
                                            </span>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
                )}
            </div>


        </>
    )

}

export default Tasks