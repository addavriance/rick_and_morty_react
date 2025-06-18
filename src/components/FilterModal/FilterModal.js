import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../Icons';
import './FilterModal.css';

const FilterModal = ({
                         isOpen,
                         onClose,
                         filterOptions,
                         currentFilters,
                         onApply,
                         type = 'character'
                     }) => {
    const [tempFilters, setTempFilters] = useState(currentFilters);

    useEffect(() => {
        setTempFilters(currentFilters);
    }, [currentFilters, isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const handleFilterChange = (filterKey, value) => {
        setTempFilters(prev => ({
            ...prev,
            [filterKey]: value
        }));
    };

    const handleApply = () => {
        onApply(tempFilters);
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getFilterLabel = (key) => {
        const labels = {
            species: 'Species',
            gender: 'Gender',
            status: 'Status',
            type: 'Type',
            dimension: 'Dimension'
        };
        return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    if (!isOpen) return null;

    return (
        <div className={`filter-modal ${isOpen ? 'is-open' : ''}`} onClick={handleBackdropClick}>
            <div className="filter-modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="filter-modal__header">
                    <h3 className="filter-modal__title">Filters</h3>
                    <button className="filter-modal__close" onClick={onClose}>
                        <CloseIcon width={20} height={20} />
                    </button>
                </div>

                <div className="filter-modal__body">
                    {Object.entries(filterOptions).map(([filterKey, options]) => (
                        <div key={filterKey} className="filter-modal__group">
                            <select
                                className="filter-modal__select"
                                value={tempFilters[filterKey] || ''}
                                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                            >
                                <option value="">All {getFilterLabel(filterKey)}</option>
                                {options.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="filter-modal__actions">
                    <button className="filter-modal__button filter-modal__button--primary" onClick={handleApply}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
