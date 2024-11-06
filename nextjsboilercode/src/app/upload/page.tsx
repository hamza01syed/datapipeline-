// app/upload/page.tsx (for Next.js 13 with App Router) or pages/upload.tsx (for Pages Router)

import FileUpload from '@/components/FileUpload'; // Adjust the path as necessary

const UploadPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Your File</h1>
      <FileUpload />
    </div>
  );
};

export default UploadPage;
