import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import toast from 'react-hot-toast'
import { useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '../api/hooks/useCMS'

export default function CMS() {
  const { data: banners = [] } = useBanners()
  const { data: faqs = [] } = useFaqs()
  const createBannerMutation = useCreateBanner()
  const updateBannerMutation = useUpdateBanner()
  const deleteBannerMutation = useDeleteBanner()
  const createFaqMutation = useCreateFaq()
  const updateFaqMutation = useUpdateFaq()
  const deleteFaqMutation = useDeleteFaq()
  
  const [showBannerModal, setShowBannerModal] = useState(false)
  const [showFaqModal, setShowFaqModal] = useState(false)
  const [bannerForm, setBannerForm] = useState({ title: '', image_url: '', display_order: 1 })
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CMS Management</h1>
        <p className="text-gray-600 mt-1">Manage banners, FAQs, and content</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Banner Management</h3>
            <Button size="sm" onClick={() => setShowBannerModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </div>
          <div className="space-y-3">
            {banners.map(banner => (
              <div key={banner.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{banner.title}</p>
                  <p className="text-sm text-gray-600">{banner.image}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateBannerMutation.mutate({ id: banner.banner_id, data: { is_active: !banner.is_active } })}
                  >
                    {banner.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => deleteBannerMutation.mutate(banner.banner_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">FAQs</h3>
            <Button size="sm" onClick={() => setShowFaqModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </div>
          <div className="space-y-3">
            {faqs.map(faq => (
              <div key={faq.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">{faq.question}</p>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => deleteFaqMutation.mutate(faq.faq_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions</h3>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-600">Last updated: March 2024</p>
            <textarea
              className="w-full mt-4 p-4 border rounded-lg h-40"
              placeholder="Enter terms and conditions..."
              defaultValue="1. All bookings are subject to availability.\n2. Payment must be made in advance.\n3. Cancellations must be made 24 hours before booking time."
            />
            <Button className="mt-4">Save Changes</Button>
          </div>
        </div>
      </div>

      <Modal isOpen={showBannerModal} onClose={() => setShowBannerModal(false)} title="Add Banner">
        <div className="space-y-4">
          <Input 
            label="Banner Title" 
            placeholder="Enter banner title" 
            value={bannerForm.title}
            onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
          />
          <Input 
            label="Image URL" 
            placeholder="Enter image URL" 
            value={bannerForm.image_url}
            onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })}
          />
          <Input 
            label="Order" 
            type="text" 
            placeholder="1" 
            value={bannerForm.display_order}
            onChange={(e) => setBannerForm({ ...bannerForm, display_order: e.target.value.replace(/\D/g, '') })}
          />
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => {
                createBannerMutation.mutate(bannerForm)
                setShowBannerModal(false)
                setBannerForm({ title: '', image_url: '', display_order: 1 })
              }} 
              className="flex-1"
              disabled={createBannerMutation.isPending}
            >
              Add Banner
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showFaqModal} onClose={() => setShowFaqModal(false)} title="Add FAQ">
        <div className="space-y-4">
          <Input 
            label="Question" 
            placeholder="Enter question" 
            value={faqForm.question}
            onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
          />
          <textarea 
            className="w-full p-3 border rounded-lg" 
            rows="4" 
            placeholder="Enter answer" 
            value={faqForm.answer}
            onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
          />
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => {
                createFaqMutation.mutate(faqForm)
                setShowFaqModal(false)
                setFaqForm({ question: '', answer: '' })
              }} 
              className="flex-1"
              disabled={createFaqMutation.isPending}
            >
              Add FAQ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
