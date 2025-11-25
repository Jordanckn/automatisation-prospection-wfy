import React, { useState, useEffect } from 'react';
import { FolderPlus, Edit2, Trash2, Users, Mail, ChevronRight } from 'lucide-react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const ListsManager = ({ prospects, onSelectList }) => {
    const [lists, setLists] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [editingList, setEditingList] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false); // Pour éviter la sauvegarde avant le chargement

    // Charger les listes depuis le localStorage à chaque montage du composant
    useEffect(() => {
        console.log('🔄 ListsManager: Chargement des listes...');
        const savedLists = loadFromStorage('prospectLists', []);
        setLists(savedLists);
        setIsInitialized(true); // Marquer comme initialisé APRÈS le chargement
    }, []); // Se déclenche à chaque fois que le composant est monté (grâce à la key)

    // Sauvegarder les listes dans le localStorage à chaque modification
    useEffect(() => {
        // NE PAS sauvegarder avant que les données soient chargées !
        if (!isInitialized) {
            console.log('⏸️ ListsManager: Sauvegarde ignorée (pas encore initialisé)');
            return;
        }

        console.log('💾 ListsManager: Sauvegarde des listes...', lists);
        saveToStorage('prospectLists', lists);
    }, [lists, isInitialized]);

    const createList = () => {
        if (!newListName.trim()) return;

        const newList = {
            id: Date.now().toString(),
            name: newListName.trim(),
            prospectIds: [],
            createdAt: new Date().toISOString(),
            color: getRandomColor()
        };

        setLists([...lists, newList]);
        setNewListName('');
        setIsCreating(false);
    };

    const deleteList = (listId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette liste ?')) {
            setLists(lists.filter(list => list.id !== listId));
        }
    };

    const updateListName = (listId, newName) => {
        setLists(lists.map(list =>
            list.id === listId ? { ...list, name: newName } : list
        ));
        setEditingList(null);
    };

    const getProspectsInList = (listId) => {
        const list = lists.find(l => l.id === listId);
        if (!list) return [];
        return prospects.filter(p => list.prospectIds.includes(p.id));
    };

    const getRandomColor = () => {
        const colors = [
            '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
            '#10b981', '#06b6d4', '#6366f1', '#f97316'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className="lists-manager">
            <div className="lists-header">
                <h2><Users size={24} /> Mes Listes de Prospects</h2>
                <button
                    className="btn-primary"
                    onClick={() => setIsCreating(true)}
                >
                    <FolderPlus size={18} /> Nouvelle Liste
                </button>
            </div>

            {isCreating && (
                <div className="list-create-form">
                    <input
                        type="text"
                        placeholder="Nom de la liste..."
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && createList()}
                        autoFocus
                    />
                    <button onClick={createList} className="btn-success">Créer</button>
                    <button onClick={() => setIsCreating(false)} className="btn-cancel">Annuler</button>
                </div>
            )}

            <div className="lists-grid">
                {lists.length === 0 ? (
                    <div className="empty-state">
                        <FolderPlus size={48} />
                        <p>Aucune liste créée</p>
                        <p className="text-muted">Créez votre première liste pour organiser vos prospects</p>
                    </div>
                ) : (
                    lists.map(list => {
                        const prospectsCount = getProspectsInList(list.id).length;

                        return (
                            <div
                                key={list.id}
                                className="list-card"
                                style={{ borderLeftColor: list.color }}
                            >
                                <div className="list-card-header">
                                    {editingList === list.id ? (
                                        <input
                                            type="text"
                                            defaultValue={list.name}
                                            onBlur={(e) => updateListName(list.id, e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    updateListName(list.id, e.target.value);
                                                }
                                            }}
                                            autoFocus
                                            className="list-name-input"
                                        />
                                    ) : (
                                        <h3>{list.name}</h3>
                                    )}

                                    <div className="list-actions">
                                        <button
                                            onClick={() => setEditingList(list.id)}
                                            className="btn-icon"
                                            title="Renommer"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteList(list.id)}
                                            className="btn-icon btn-danger"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="list-card-body">
                                    <div className="list-stat">
                                        <Users size={20} />
                                        <span>{prospectsCount} prospect{prospectsCount > 1 ? 's' : ''}</span>
                                    </div>

                                    <div className="list-date">
                                        Créée le {new Date(list.createdAt).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>

                                <div className="list-card-footer">
                                    <button
                                        className="btn-secondary btn-block"
                                        onClick={() => onSelectList(list)}
                                    >
                                        <Mail size={16} />
                                        Gérer les prospects
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ListsManager;
