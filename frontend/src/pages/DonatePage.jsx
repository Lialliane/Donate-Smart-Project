import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '../components/Common/radio-group';
import { Checkbox } from '../components/Common/checkbox';
import { Icon } from '@iconify/react';
import { Label } from "@radix-ui/react-label";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { CaseCard } from '../components/Common/CaseCard';
import toast from 'react-hot-toast';


const dummyData = {
  id: 1,
  title: 'Education for Underprivileged Children',
  category: 'Education',
  shortDescription: 'Help provide books, supplies, and educational resources to children in rural communities who lack access to quality education.',
  image: 'https://images.unsplash.com/photo-1760267973986-5370a55550f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGVkdWNhdGlvbiUyMGxlYXJuaW5nfGVufDF8fHx8MTc2MzQxMjkyMnww&ixlib=rb-4.1.0&q=80&w=1080',
  raised: 12500,
  goal: 20000,
  progress: 62.5,
  owner: 'Sarah Johnson',
  verified: true,
};

const presetAmounts = [10, 25, 50, 100, 250, 500];

export function DonatePage() {
  const { id } = useParams();
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [coverFees, setCoverFees] = useState(true);
  const [caseData, setCaseData] = useState(dummyData);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const parsedCustomAmount = Number(customAmount);
  const currentAmount =
    parsedCustomAmount > 0
      ? parsedCustomAmount
      : selectedAmount > 0
        ? selectedAmount
        : 0;
  const processingFee = currentAmount > 0 ? currentAmount * 0.03 : 0;
  const totalAmount =
    currentAmount > 0
      ? coverFees
        ? currentAmount + processingFee
        : currentAmount
      : 0;


  useEffect(() => {
    if (!currentUser || currentUser.role === "admin") navigate('/');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

  }, [])

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await axios.get(`/api/cases/${id}`);
        setCaseData(res.data || dummyData);
        //if(currentUser?._id === res.data?.createdBy ) navigate('/');

      } catch (err) {
        console.error(
          "Error fetching case:",
          err.response?.data || err.message
        );
      }
    };

    fetchCase();
  }, [id]);

  async function donate(caseId, caseTitle, userId, amount) {
    try {
      const res = await axios.post(
        "/api/payment/checkout",
        { caseId, caseTitle, userId, amount }
      );

      const { url } = res.data;
      window.location.href = url;
    } catch (err) {
      console.error("Donation failed:", err);
      toast.error("Payment failed, please try again!");
    }
  }

  const handleDonateClick = () => {
    donate(id, caseData?.title || "", currentUser._id, totalAmount);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)]">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Link to={`/case/${id}`} className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-8 transition-colors">
          <Icon icon="lucide:arrow-left" className="w-5 h-5" />
          <span>Back to Case Details</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Donation Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src='/images/logo/logo2.svg'
                  alt='Logo'
                  width={48}
                  height={64}
                  className='rounded-full shadow-md'
                />
                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-dark)]">Make a Donation</h2>
              </div>

              {/* Amount Selection */}
              <div className="space-y-4 mb-8">
                <Label className="text-[var(--color-text-dark)]">Select or enter amount</Label>
                <div className="grid grid-cols-3 gap-3">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`py-4 px-6 rounded-2xl border-2 transition-all ${selectedAmount === amount && !customAmount
                        ? 'border-[var(--color-primary)] bg-[#7fdb34]/10 text-[var(--color-primary)]'
                        : 'border-gray-200 text-[var(--color-text-light)] hover:border-[#7fdb34)]/50'
                        }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] text-xl">$</span>
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    min={1}
                    step="1"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value !== "" && Number(value) <= 0) return;

                      setCustomAmount(value);
                      setSelectedAmount(null);
                    }}
                    className="file:text-black py-6 placeholder:text-gray-400 selection:bg-[var(--color-primary)] selection:text-white dark:bg-[--color-bg-soft] border-input flex h-9 w-full min-w-0 px-3 text-base bg-input-background outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-12 rounded-2xl border-2 border-gray-200 focus:border-[var(--color-primary)] transition-colors"
                  />

                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4 mb-8">
                <Label className="text-[var(--color-text-dark)]">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[var(--color-primary)] bg-[#7fdb34]/5' : 'border-gray-200'
                    }`}>
                    <RadioGroupItem value="card" id="card" />
                    <Icon icon="lucide:credit-card" className="w-5 h-5 text-[var(--color-text-light)]" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer text-[var(--color-text-dark)]">
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-[var(--color-primary)] bg-[#7fdb34]/5' : 'border-gray-200'
                    }`}>
                    <RadioGroupItem value="bank" id="bank" />
                    <Icon icon="lucide:building-2" className="w-5 h-5 text-[var(--color-text-light)]" />
                    <Label htmlFor="bank" className="flex-1 cursor-pointer text-[var(--color-text-dark)]">
                      Bank Transfer
                    </Label>
                  </div>
                  <div className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'mobile' ? 'border-[var(--color-primary)] bg-[#7fdb34]/5' : 'border-gray-200'
                    }`}>
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Icon icon="lucide:smartphone" className="w-5 h-5 text-[var(--color-text-light)]" />
                    <Label htmlFor="mobile" className="flex-1 cursor-pointer text-[var(--color-text-dark)]">
                      Mobile Payment
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Cover Processing Fees */}
              <div className="flex items-center gap-3 mb-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                <Checkbox
                  id="coverFees"
                  checked={coverFees}
                  onCheckedChange={(checked) => setCoverFees(checked)}
                />
                <Label data-slot="label" htmlFor="coverFees" className="text-[var(--color-text-dark)] cursor-pointer">
                  Cover ${processingFee.toFixed(2)} in processing fees
                  <span className="block text-sm text-[var(--color-text-light)] mt-1 items-center gap-2 leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    100% of your donation goes to the cause
                  </span>
                </Label>
              </div>

              {/* Donate Button */}
              <button
                onClick={handleDonateClick}
                disabled={currentAmount <= 0}
                className='w-full lg:block bg-[var(--color-primary)] text-white text-base font-medium hover:bg-transparent duration-300 hover:text-[var(--color-primary)] border border-[var(--color-primary)] px-6 py-3 rounded-full hover:cursor-pointer shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Donate ${totalAmount.toFixed(2)}
              </button>

              {/* Security Notice */}
              <div className="flex items-center gap-2 justify-center mt-6 text-[var(--color-text-light)] text-sm">
                <Icon icon="lucide:shield" className="w-4 h-4" />
                <span>Secure payment • Your data is protected</span>
              </div>
            </div>
          </div>

          {/* Sidebar - Case Summary */}
          <div className="space-y-6">
            {/* Case Info */}
            <CaseCard caseItem={caseData} buttonText={""} />

            {/* Donation Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)]">
              <h4 className="text-[var(--color-text-dark)] mb-4">Donation Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-light)]">Donation amount</span>
                  <span className="text-[var(--color-text-dark)]">${currentAmount.toFixed(2)}</span>
                </div>
                {coverFees && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-light)]">Processing fee</span>
                    <span className="text-[var(--color-text-dark)]">${processingFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-dark)]">Total</span>
                    <span className="text-[var(--color-primary)]">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Donate */}
            <div className="bg-gradient-to-br from-[#7fdb34]/10 to-[#6bc428]/10 rounded-3xl p-6">
              <h4 className="text-[var(--color-text-dark)] mb-3">Why Your Donation Matters</h4>
              <ul className="space-y-2 text-sm text-[var(--color-text-light)]">
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:circle-check" className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <span>100% verified and transparent cases</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:circle-check" className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <span>Direct impact on communities in need</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:circle-check" className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <span>Regular updates on fund usage</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:circle-check" className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <span>Secure and protected donations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
