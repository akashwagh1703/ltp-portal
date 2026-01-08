import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Upload, X, Star } from 'lucide-react'
import Button from '../components/ui/Button'
import { turfService } from '../services/turfService'
import { turfImageService } from '../services/turfImageService'
import toast from 'react-hot-toast'

export default function TurfImages() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [turf, setTurf] = useState(null)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTurf()
  }, [id])

  const loadTurf = async () => {
    try {
      const response = await turfService.getById(id)
      console.log('Turf data:', response.data)
      console.log('Images:', response.data.images)
      setTurf(response.data)
      setImages(response.data.images || [])
    } catch (error) {
      console.error('Load turf error:', error)
      toast.error('Failed to load turf')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Only JPG, JPEG, PNG, and GIF images are allowed`)
        return false
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: Image size must not exceed 5MB`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    const formData = new FormData()
    
    // Append files with simple array notation
    validFiles.forEach((file, index) => {
      console.log(`Adding file ${index}:`, file.name, file.size, file.type)
      formData.append('images[]', file, file.name)
    })

    // Log FormData contents
    console.log('📤 FormData entries:')
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1])
    }
    
    console.log('📤 Uploading files:', validFiles.map(f => ({ name: f.name, size: f.size, type: f.type })))

    try {
      const result = await turfImageService.upload(id, formData)
      console.log('✅ Upload success:', result)
      toast.success('Images uploaded successfully')
      e.target.value = '' // Reset file input
      loadTurf()
    } catch (error) {
      console.error('❌ Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      await turfImageService.delete(imageId)
      toast.success('Image deleted')
      loadTurf()
    } catch (error) {
      toast.error('Failed to delete image')
    }
  }

  const handleSetPrimary = async (imageId) => {
    try {
      await turfImageService.setPrimary(imageId)
      toast.success('Primary image updated')
      loadTurf()
    } catch (error) {
      toast.error('Failed to set primary image')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/turfs')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Images</h1>
          <p className="text-gray-600 mt-1">{turf?.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-lg text-gray-600 mb-1">Click to upload images</p>
            <p className="text-sm text-gray-500">JPG, JPEG, PNG, GIF up to 5MB each</p>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {uploading && (
            <p className="text-center text-primary mt-3">Uploading...</p>
          )}
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No images uploaded yet
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => {
              const imagePath = img.image_path ? encodeURI(img.image_path) : ''
              const imageUrl = img.image_url || `http://143.110.183.5/storage/${imagePath}`
              console.log('Image URL:', imageUrl, 'Image object:', img)
              return (
              <div key={img.id} className="relative group">
                <img
                  src={imageUrl}
                  alt="Turf"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Image load failed:', imageUrl)
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleSetPrimary(img.id)}
                    className={`p-2 rounded-full ${
                      img.is_primary ? 'bg-yellow-500' : 'bg-white'
                    } hover:scale-110 transition-transform`}
                    title="Set as primary"
                  >
                    <Star className={`h-5 w-5 ${img.is_primary ? 'text-white' : 'text-gray-700'}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                    title="Delete"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {img.is_primary && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Primary
                  </div>
                )}
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  )
}
