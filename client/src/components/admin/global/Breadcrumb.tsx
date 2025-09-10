import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  text: string;
  link?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <Card className='my-5'>
      <CardContent>
        <nav className="flex items-center text-sm text-gray-500">
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              {item.link ? (
                <Link to={item.link} className="hover:text-blue-600 transition-colors">
                  {item.text}
                </Link>
              ) : (
                <span className="font-medium text-gray-700">{item.text}</span>
              )}
              {index < items.length - 1 && <span className="mx-2">/</span>}
            </div>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};

export default Breadcrumb;