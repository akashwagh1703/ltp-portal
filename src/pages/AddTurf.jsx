import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Upload, X, Plus, Check } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { SPORT_TYPES } from '../utils/constants'
import toast from 'react-hot-toast'
import { useOwners } from '../api/hooks/useOwners'
import { turfService } from '../services/turfService'

export default function AddTurf() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const { data: owners = [] } = useOwners()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sport_type: '',
    owner_id: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    lat: '',
    lng: '',
    size: '',
    capacity: '',
    opening_time: '06:00',
    closing_time: '23:00',
    slot_duration: '60'
  })

  const [pricingType, setPricingType] = useState('uniform') // uniform or dynamic
  const [uniformPrice, setUniformPrice] = useState('')
  const [dynamicPricing, setDynamicPricing] = useState({
    weekday: { morning: '', afternoon: '', evening: '', night: '' },
    weekend: { morning: '', afternoon: '', evening: '', night: '' }
  })

  const [images, setImages] = useState([])
  const [amenities, setAmenities] = useState([])
  const [newAmenity, setNewAmenity] = useState('')

  const timeSlots = [
    { label: 'Morning (6 AM - 12 PM)', key: 'morning' },
    { label: 'Afternoon (12 PM - 4 PM)', key: 'afternoon' },
    { label: 'Evening (4 PM - 8 PM)', key: 'evening' },
    { label: 'Night (8 PM - 11 PM)', key: 'night' }
  ]

  const ownerOptions = owners
    .filter(owner => owner.status === 'active')
    .map(owner => ({
      value: owner.id?.toString() || owner.owner_id?.toString() || '',
      label: `${owner.name} (${owner.turfs_count || owner.total_turfs || 0} turfs)`
    }))
    .filter(option => option.value)

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true)
      turfService.getById(id)
        .then(response => {
          const turf = response.data
          setFormData({
            name: turf.name || '',
            description: turf.description || '',
            sport_type: turf.sport_type || '',
            owner_id: turf.owner_id?.toString() || '',
            address_line1: turf.address_line1 || '',
            address_line2: turf.address_line2 || '',
            city: turf.city || '',
            state: turf.state || '',
            pincode: turf.pincode || '',
            lat: turf.latitude?.toString() || '',
            lng: turf.longitude?.toString() || '',
            size: turf.size || '',
            capacity: turf.capacity?.toString() || '',
            opening_time: turf.opening_time || '06:00',
            closing_time: turf.closing_time || '23:00',
            slot_duration: turf.slot_duration?.toString() || '60'
          })
          
          // Load pricing
          setPricingType(turf.pricing_type || 'uniform')
          if (turf.pricing_type === 'uniform') {
            setUniformPrice(turf.uniform_price?.toString() || '')
          } else if (turf.pricing && Array.isArray(turf.pricing)) {
            // Convert pricing array to dynamic pricing object
            const pricing = { weekday: {}, weekend: {} }
            turf.pricing.forEach(p => {
              pricing[p.day_type][p.time_slot] = p.price?.toString() || ''
            })
            setDynamicPricing(pricing)
          }
          
          // Load amenities
          if (turf.amenities && Array.isArray(turf.amenities)) {
            setAmenities(turf.amenities.map(a => a.amenity_name || a))
          }
          
          // Load images
          if (turf.images && Array.isArray(turf.images)) {
            setImages(turf.images.map(img => ({
              name: img.image_path?.split('/').pop() || 'image',
              url: img.image_path || '',
              file: null
            })))
          }
        })
        .catch(() => toast.error('Failed to load turf details'))
        .finally(() => setLoading(false))
    }
  }, [isEdit, id])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file
    }))
    setImages([...images, ...newImages])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity('')
    }
  }

  const removeAmenity = (amenity) => {
    setAmenities(amenities.filter(a => a !== amenity))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Prepare pricing data
    let pricingData = []
    if (pricingType === 'dynamic') {
      Object.entries(dynamicPricing).forEach(([dayType, slots]) => {
        Object.entries(slots).forEach(([timeSlot, price]) => {
          if (price) {
            pricingData.push({
              day_type: dayType,
              time_slot: timeSlot,
              price: parseFloat(price)
            })
          }
        })
      })
    }
    
    // Create FormData for multipart upload
    const formDataToSend = new FormData()
    
    // Add basic fields (excluding lat/lng and numeric fields)
    formDataToSend.append('name', formData.name)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('sport_type', formData.sport_type)
    formDataToSend.append('address_line1', formData.address_line1)
    if (formData.address_line2) formDataToSend.append('address_line2', formData.address_line2)
    formDataToSend.append('city', formData.city)
    formDataToSend.append('state', formData.state)
    formDataToSend.append('pincode', formData.pincode)
    formDataToSend.append('size', formData.size)
    formDataToSend.append('opening_time', formData.opening_time)
    formDataToSend.append('closing_time', formData.closing_time)
    
    // Add numeric fields
    formDataToSend.append('owner_id', formData.owner_id)
    formDataToSend.append('capacity', formData.capacity)
    formDataToSend.append('slot_duration', formData.slot_duration)
    if (formData.lat) formDataToSend.append('latitude', formData.lat)
    if (formData.lng) formDataToSend.append('longitude', formData.lng)
    
    // Add pricing
    formDataToSend.append('pricing_type', pricingType)
    if (pricingType === 'uniform' && uniformPrice) {
      formDataToSend.append('uniform_price', uniformPrice)
    }
    
    // Add pricing array as JSON
    if (pricingType === 'dynamic' && pricingData.length > 0) {
      formDataToSend.append('pricing', JSON.stringify(pricingData))
    }
    
    // Add amenities as JSON
    if (amenities.length > 0) {
      formDataToSend.append('amenities', JSON.stringify(amenities))
    }
    
    // Add _method for Laravel PUT via POST
    if (isEdit) {
      formDataToSend.append('_method', 'PUT')
    }
    
    // Add image files only if there are new uploads
    const newImages = images.filter(img => img.file && img.file instanceof File)
    newImages.forEach((img) => {
      formDataToSend.append('images[]', img.file)
    })
    
    try {
      if (isEdit) {
        await turfService.update(id, formDataToSend)
        toast.success('Turf updated successfully')
      } else {
        await turfService.create(formDataToSend)
        toast.success('Turf added successfully')
      }
      navigate('/turfs')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save turf')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/turfs')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Turf' : 'Add New Turf'}
              </h1>
              <p className="text-sm text-gray-600">Fill in the details below</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <Input
                  label="Turf Name *"
                  placeholder="e.g., Green Valley Sports Arena"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows="4"
                    placeholder="Describe your turf, facilities, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Sport Type *"
                    value={formData.sport_type}
                    onChange={(value) => setFormData({ ...formData, sport_type: value })}
                    options={SPORT_TYPES.map(sport => ({ value: sport, label: sport }))}
                    placeholder="Select sport"
                  />

                  <Select
                    label="Owner *"
                    value={formData.owner_id}
                    onChange={(value) => setFormData({ ...formData, owner_id: value })}
                    options={ownerOptions}
                    placeholder="Select owner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Size *"
                    placeholder="e.g., 100x50 ft"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    required
                  />

                  <Input
                    label="Capacity (Players) *"
                    type="text"
                    placeholder="e.g., 22"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h2>
              <div className="space-y-4">
                <Input
                  label="Address Line 1 *"
                  placeholder="Building/Street name"
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  required
                />

                <Input
                  label="Address Line 2"
                  placeholder="Area/Locality"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                />

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="City *"
                    placeholder="Pune"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />

                  <Input
                    label="State *"
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />

                  <Input
                    label="Pincode *"
                    type="text"
                    placeholder="411045"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Latitude"
                    type="text"
                    placeholder="18.5593"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  />

                  <Input
                    label="Longitude"
                    type="text"
                    placeholder="73.7789"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
              
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPricingType('uniform')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    pricingType === 'uniform'
                      ? 'border-primary bg-primary-light text-primary font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Check className={`h-5 w-5 mx-auto mb-1 ${pricingType === 'uniform' ? 'block' : 'hidden'}`} />
                  Uniform Pricing
                  <p className="text-xs mt-1">Same price for all days & times</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPricingType('dynamic')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    pricingType === 'dynamic'
                      ? 'border-primary bg-primary-light text-primary font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Check className={`h-5 w-5 mx-auto mb-1 ${pricingType === 'dynamic' ? 'block' : 'hidden'}`} />
                  Dynamic Pricing
                  <p className="text-xs mt-1">Different prices for days & times</p>
                </button>
              </div>

              {pricingType === 'uniform' ? (
                <Input
                  label="Price per Hour (₹) *"
                  type="text"
                  placeholder="1500"
                  value={uniformPrice}
                  onChange={(e) => setUniformPrice(e.target.value.replace(/\D/g, ''))}
                  required
                />
              ) : (
                <div className="space-y-6">
                  {/* Weekday Pricing */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Weekday</span>
                      Monday - Friday
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map(slot => (
                        <Input
                          key={`weekday-${slot.key}`}
                          label={slot.label}
                          type="text"
                          placeholder="₹ 1500"
                          value={dynamicPricing.weekday[slot.key]}
                          onChange={(e) => setDynamicPricing({
                            ...dynamicPricing,
                            weekday: { ...dynamicPricing.weekday, [slot.key]: e.target.value.replace(/\D/g, '') }
                          })}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Weekend Pricing */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Weekend</span>
                      Saturday - Sunday
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map(slot => (
                        <Input
                          key={`weekend-${slot.key}`}
                          label={slot.label}
                          type="text"
                          placeholder="₹ 2000"
                          value={dynamicPricing.weekend[slot.key]}
                          onChange={(e) => setDynamicPricing({
                            ...dynamicPricing,
                            weekend: { ...dynamicPricing.weekend, [slot.key]: e.target.value.replace(/\D/g, '') }
                          })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Timing & Slots */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h2>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Opening Time *"
                  type="time"
                  value={formData.opening_time}
                  onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })}
                  required
                />

                <Input
                  label="Closing Time *"
                  type="time"
                  value={formData.closing_time}
                  onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })}
                  required
                />

                <Input
                  label="Slot Duration (min) *"
                  type="text"
                  placeholder="60"
                  value={formData.slot_duration}
                  onChange={(e) => setFormData({ ...formData, slot_duration: e.target.value.replace(/\D/g, '') })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
              
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload images</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img.url} alt={img.name} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add amenity..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <Button type="button" onClick={addAmenity} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                    {amenity}
                    <button type="button" onClick={() => removeAmenity(amenity)} className="hover:text-green-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {amenities.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No amenities added yet</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Turf' : 'Add Turf'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/turfs')}
                className="w-full mt-3"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
