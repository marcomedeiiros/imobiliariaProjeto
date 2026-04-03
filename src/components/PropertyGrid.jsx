import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import PropertyModal from './PropertyModal';
import AddPropertyModal from './AddPropertyModal';


const PropertyGrid = ({ isAdmin, filters }) => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load and Migtration Logic
  useEffect(() => {
    const initData = async () => {
      try {
        // 1. Fetch from server
        const response = await fetch('/api/properties');
        const serverData = await response.json();
        
        // 2. Check for local data to migrate
        const localSaved = localStorage.getItem('properties_data');
        const localData = localSaved ? JSON.parse(localSaved) : [];

        if (serverData.length === 0 && localData.length > 0) {
          console.log('Migrating local data to server...');
          await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ properties: localData })
          });
          setProperties(localData);
          // 3. Cleanup local storage after migration
          localStorage.removeItem('properties_data');
        } else {
          setProperties(serverData);
        }
      } catch (err) {
        console.error('Data initialization error:', err);
        setErrorStatus('Falha ao conectar com o servidor. Verifique se o "npm run server" está rodando.');
        
        // Fallback to local if server is down (safety)
        const localSaved = localStorage.getItem('properties_data');
        if (localSaved) setProperties(JSON.parse(localSaved));
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  // Sync state to server on change
  const saveToServer = async (newData) => {
    try {
      await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: newData })
      });
    } catch (err) {
      console.error('Failed to sync with server:', err);
      // Fallback save to localStorage if server fails
      localStorage.setItem('properties_data', JSON.stringify(newData));
    }
  };

  // Filtering logic
  const filteredProperties = properties.filter(property => {
    const matchLocation = (property?.location || '').toLowerCase().includes(filters?.location?.trim().toLowerCase() || '');
    const matchType = !filters?.type || filters.type === 'Todos' ? true : property?.type === filters.type;
    
    // Simple price filter logic
    let matchPrice = true;
    if (filters?.price && filters.price !== 'Todos' && property?.price) {
      const p = parseInt(String(property.price).replace(/[^\d]/g, '')) || 0;
      if (filters.price === 'Até R$ 500k') {
        matchPrice = p <= 500000;
      } else if (filters.price === 'R$ 500k - R$ 1.5M') {
        matchPrice = p > 500000 && p <= 1500000;
      } else if (filters.price === 'Acima de R$ 1.5M') {
        matchPrice = p > 1500000;
      }
    }

    return matchLocation && matchType && matchPrice;
  });

  const handleAddProperty = (newProperty) => {
    const updated = [newProperty, ...properties];
    setProperties(updated);
    saveToServer(updated);
  };

  const handleEditProperty = (updatedProperty) => {
    const updated = properties.map(p => p.id === updatedProperty.id ? updatedProperty : p);
    setProperties(updated);
    saveToServer(updated);
    setEditingProperty(null);
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este terreno?')) {
      const updated = properties.filter(p => p.id !== id);
      setProperties(updated);
      saveToServer(updated);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', color: 'var(--primary)' }}>
        Carregando terrenos...
      </div>
    );
  }

  return (
    <section id="terrenos" className="section container">
      {errorStatus && (
        <div style={{ background: 'rgba(255,0,0,0.1)', color: 'red', padding: '15px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>
          {errorStatus}
        </div>
      )}
      <div style={{ 
        marginBottom: '2rem', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        gap: '20px',
        textAlign: 'center'
      }}>
        <div style={{ width: '100%' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', marginBottom: '0.8rem' }}>Propriedades em Destaque</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', marginInline: 'auto', fontSize: '0.9rem' }}>
            {filteredProperties.length > 0 
              ? `Encontramos ${filteredProperties.length} excelente(s) oportunidade(s).`
              : 'Nenhum terreno encontrado. Tente ajustar sua busca.'}
          </p>
        </div>
        
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            width: 'auto',
            padding: '12px 24px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>+</span> Novo Terreno
          </button>
        )}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '2rem',
        justifyContent: 'center'
      }}>
        {filteredProperties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            isAdmin={isAdmin}
            onOpen={setSelectedProperty} 
            onEdit={setEditingProperty}
            onDelete={handleDeleteProperty}
          />
        ))}
      </div>

      {selectedProperty && (
        <PropertyModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}

      {(showAddModal || editingProperty) && (
        <AddPropertyModal 
          onAdd={handleAddProperty} 
          onEdit={handleEditProperty}
          editProperty={editingProperty}
          onClose={() => {
            setShowAddModal(false);
            setEditingProperty(null);
          }} 
        />
      )}
    </section>
  );
};

export default PropertyGrid;
