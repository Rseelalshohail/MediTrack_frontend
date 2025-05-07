import logo from '../../assets/images/logo.png'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-emerald-100 shadow-inner mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Logo + App Description */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center space-x-3 mb-3">
                            <img src={logo} alt="MediTrack Logo" className="h-10 w-auto" />
                            <span className="text-xl font-bold text-emerald-700 tracking-tight">MediTrack</span>
                        </div>
                        <p className="text-sm text-gray-600 text-center md:text-left">
                        A smart platform for managing medical devices, maintenance, and spare parts. Built to support efficient, reliable healthcare operations.                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-emerald-700 font-medium mb-3">Contact</h3>
                        <div className="flex flex-col space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <span>support@meditrack.example.com</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                <span>+966 555114444</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-500">
                        © {currentYear} MediTrack Healthcare Solutions. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}