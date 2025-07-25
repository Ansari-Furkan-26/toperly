import React, { useState, useEffect } from 'react';

const ImageDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/unsquare-toperly/images', {
          headers: {
            'AccessKey': '249dd0e1-444c-432f-91e55d5ef213-b7bd-49e3',
            'accept': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Image Data</h1>
      {data.length === 0 ? (
        <p className="text-center text-gray-600">No images found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border-b">Object Name</th>
                <th className="py-2 px-4 border-b">Length</th>
                <th className="py-2 px-4 border-b">Last Changed</th>
                <th className="py-2 px-4 border-b">Date Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.Guid} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-gray-900">{item.ObjectName}</td>
                  <td className="py-2 px-4 border-b text-gray-900">{item.Length}</td>
                  <td className="py-2 px-4 border-b text-gray-900">{item.LastChanged}</td>
                  <td className="py-2 px-4 border-b text-gray-900">{item.DateCreated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ImageDataTable;