
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [month, setMonth] = useState('03');

    useEffect(() => {
        fetchTransactions();
    }, [search, page, month]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions`, {
                params: { month, search, page }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };
    

    return (
        <div>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                {/* Add other months */}
            </select>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions"
            />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => setPage(page - 1)}>Previous</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
};

export default TransactionsTable;
