import { useState } from 'react';
import { itemOptions } from '../data/itemOptions';
import { designComplexityOptions } from '../data/designComplexity';
import { calculateEstimate } from '../utils/calculateEstimate';

const digitizingOptions = [
  { value: 'no', label: 'No — I have an embroidery file' },
  { value: 'yes', label: 'Yes — I need digitizing' },
  { value: 'unsure', label: 'Not sure' },
];

export default function EstimateForm({ onEstimate, initialFormData }) {
  const [formData, setFormData] = useState({
    itemType: initialFormData?.itemType || '',
    quantity: initialFormData?.quantity || '',
    designComplexity: initialFormData?.designComplexity || '',
    digitizingNeeded: initialFormData?.digitizingNeeded || '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = calculateEstimate(formData);
    onEstimate({ result, formData });
  };

  const isValid = formData.itemType && formData.quantity && parseInt(formData.quantity, 10) >= 1 &&
    formData.designComplexity && formData.digitizingNeeded;

  return (
    <div className="form-card">
      <h3>Calculate Your Estimate</h3>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="itemType">
            Item Type <span className="required" aria-hidden="true">*</span>
          </label>
          <select
            id="itemType"
            name="itemType"
            className="form-control"
            value={formData.itemType}
            onChange={handleChange}
            required
            aria-required="true"
          >
            <option value="">— Select item —</option>
            {itemOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">
            Quantity <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            className="form-control"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            max="500"
            placeholder="e.g. 24"
            required
            aria-required="true"
          />
          <p className="form-hint">Enter the total number of items to embroider.</p>
        </div>

        <div className="form-group">
          <label htmlFor="designComplexity">
            Design Complexity <span className="required" aria-hidden="true">*</span>
          </label>
          <select
            id="designComplexity"
            name="designComplexity"
            className="form-control"
            value={formData.designComplexity}
            onChange={handleChange}
            required
            aria-required="true"
          >
            <option value="">— Select complexity —</option>
            {designComplexityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {formData.designComplexity && (
            <p className="form-hint">
              {designComplexityOptions.find(o => o.value === formData.designComplexity)?.stitchDescription}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="digitizingNeeded">
            Digitizing Needed? <span className="required" aria-hidden="true">*</span>
          </label>
          <select
            id="digitizingNeeded"
            name="digitizingNeeded"
            className="form-control"
            value={formData.digitizingNeeded}
            onChange={handleChange}
            required
            aria-required="true"
          >
            <option value="">— Select option —</option>
            {digitizingOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className="form-hint">Digitizing converts your design into an embroidery file ($30–$75 one-time fee).</p>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={!isValid}>
            Calculate Estimate
          </button>
        </div>
      </form>
    </div>
  );
}
