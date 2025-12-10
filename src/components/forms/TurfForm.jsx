import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { SPORT_TYPES } from '../../utils/constants'
import { turfNameSchema, addressSchema, priceSchema, latLngSchema } from '../../utils/validators'
import { mockOwners } from '../../data/mockData'

const turfSchema = z.object({
  name: turfNameSchema,
  address: addressSchema,
  lat: latLngSchema,
  lng: latLngSchema,
  price_per_hour: priceSchema,
  sport_type: z.string().min(1, 'Sport type is required'),
  owner_id: z.string().min(1, 'Owner is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  size: z.string().min(1, 'Size is required'),
  capacity: z.string().regex(/^\d+$/, 'Capacity must be a number'),
  opening_time: z.string().min(1, 'Opening time is required'),
  closing_time: z.string().min(1, 'Closing time is required'),
  slot_duration: z.string().regex(/^\d+$/, 'Slot duration must be a number')
})

export default function TurfForm({ initialData, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(turfSchema),
    defaultValues: initialData || {}
  })

  const [images, setImages] = useState([])
  const [amenities, setAmenities] = useState([])
  const [newAmenity, setNewAmenity] = useState('')

  const sportType = watch('sport_type')
  const ownerId = watch('owner_id')

  const ownerOptions = mockOwners
    .filter(owner => owner.status === 'active')
    .map(owner => ({
      value: owner.owner_id.toString(),
      label: `${owner.name} (${owner.total_turfs} turfs)`
    }))

  const handleImageAdd = (e) => {
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
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity('')
    }
  }

  const removeAmenity = (index) => {
    setAmenities(amenities.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit((data) => onSubmit({ ...data, images, amenities }))} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="bg-blue-50 p-3 rounded-lg mb-4">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">Basic Information</h4>
      </div>

      <Input
        label="Turf Name"
        placeholder="Enter turf name"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows="3"
          placeholder="Describe your turf..."
          {...register('description')}
        />
        {errors.description && <p className="mt-1 text-sm text-danger">{errors.description.message}</p>}
      </div>

      <Input
        label="Address"
        placeholder="Enter full address"
        error={errors.address?.message}
        {...register('address')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Latitude"
          type="text"
          placeholder="18.5204"
          error={errors.lat?.message}
          {...register('lat')}
        />

        <Input
          label="Longitude"
          type="text"
          placeholder="73.8567"
          error={errors.lng?.message}
          {...register('lng')}
        />
      </div>

      <Input
        label="Price per Hour (₹)"
        type="text"
        placeholder="1500"
        error={errors.price_per_hour?.message}
        {...register('price_per_hour')}
      />

      <Select
        label="Sport Type"
        value={sportType}
        onChange={(value) => setValue('sport_type', value)}
        options={SPORT_TYPES.map(sport => ({ value: sport, label: sport }))}
        error={errors.sport_type?.message}
      />

      <Select
        label="Owner"
        value={ownerId}
        onChange={(value) => setValue('owner_id', value)}
        options={ownerOptions}
        error={errors.owner_id?.message}
        placeholder="Select owner"
      />

      <div className="bg-green-50 p-3 rounded-lg mb-4 mt-6">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">Turf Specifications</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Size"
          type="text"
          placeholder="e.g., 100x50 ft"
          error={errors.size?.message}
          {...register('size')}
        />

        <Input
          label="Capacity (Players)"
          type="text"
          placeholder="e.g., 22"
          error={errors.capacity?.message}
          {...register('capacity')}
        />
      </div>

      <div className="bg-orange-50 p-3 rounded-lg mb-4 mt-6">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">Timing & Slots</h4>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Opening Time"
          type="text"
          placeholder="06:00 AM"
          error={errors.opening_time?.message}
          {...register('opening_time')}
        />

        <Input
          label="Closing Time"
          type="text"
          placeholder="11:00 PM"
          error={errors.closing_time?.message}
          {...register('closing_time')}
        />

        <Input
          label="Slot Duration (min)"
          type="text"
          placeholder="60"
          error={errors.slot_duration?.message}
          {...register('slot_duration')}
        />
      </div>

      <div className="bg-purple-50 p-3 rounded-lg mb-4 mt-6">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">Images</h4>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageAdd}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img.url} alt={img.name} className="w-full h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-pink-50 p-3 rounded-lg mb-4 mt-6">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">Amenities</h4>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Amenities</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="e.g., Parking, Washroom, Drinking Water"
            className="flex-1 px-4 py-2 border rounded-lg"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
          />
          <Button type="button" onClick={addAmenity} size="sm">
            Add
          </Button>
        </div>
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {amenities.map((amenity, idx) => (
              <span key={idx} className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm flex items-center gap-2">
                {amenity}
                <button
                  type="button"
                  onClick={() => removeAmenity(idx)}
                  className="text-primary hover:text-primary-dark"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
        <Button type="submit" loading={loading} className="flex-1">
          {initialData ? 'Update Turf' : 'Add Turf'}
        </Button>
      </div>
    </form>
  )
}
