import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { ItemService } from '../../services/item.service';
import { Item } from '../../interfaces/item.interface';
import { Order } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';
import { Review } from '../../interfaces/review.interface';
import { ReviewService } from '../../services/review.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { LocationService } from '../../services/location.service';
import { InsightService } from '../../services/insight.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatIconModule], // Add other required imports
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'], // Fixed typo
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  items: Item[] = [];
  locations: any[] = [];
  orders: Order[] = [];
  reviews: Review[] = [];
  barGraphData: any;
  notifications: Notification[] = [];
  displayedNotifications: Notification[] = [];
  showRead: boolean = false;
  feedbackText: string = '';
  feedbackStatus: string = '';
  selectedLocation: string = '';
  analysisResponse = '';
  pleaseWaitText = 'Fetching your response, please wait!'

  public chart_1: any;
  public chart_2: any;

  constructor(
    private authService: AuthService,
    private itemService: ItemService,
    private orderService: OrderService,
    private snackbar: SnackbarService,
    private reviewService: ReviewService,
    private notificationService: NotificationService,
    private locationService:LocationService,
    private insightService: InsightService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if(this.user.role==='admin'){
      this.getItems();
      this.getOrders();
      this.getReviews();
    }
   
    this.fetchNotifications();
    this.fetchLocations();

    console.log(this.barGraphData);
  }

  signOut() {
    this.authService.logout();
    this.snackbar.showSnackbar("Logged out successfully");
  }

  getItems() {
    this.itemService.getItems().subscribe({
      next: (response) => {
        this.items = response.data || [];
        console.log(this.items);
        this.barGraphData = this.items.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {});
        console.log(this.barGraphData);
        this.prepareItemsChart();
      },
      error: (err) => {
        console.error('Error fetching items:', err);
      },
    });
  }

  markAsRead(notId: string) {
    this.notificationService.maskNotificationAsRead(notId).subscribe({
      next: (res) => {
        console.log(res.data);
        this.fetchNotifications();
      },
      error: (err) => {
        console.log("Error marking notification read: ", err)
      }
    });
  }

  submitFeedback() {
    if (this.selectedLocation.trim() && this.feedbackText.trim()) {
      const review: Review = {
        locName: this.selectedLocation, // Assuming locName is the location name; adjust if needed
        review: this.feedbackText,
      };
  
      // Call the addReview function to send the review
      this.reviewService.postReview(review).subscribe({
        next: (response) => {
          console.log('Feedback submitted successfully:', response);
          this.feedbackStatus = 'Thank you for your feedback!';
          this.feedbackText = '';
          this.selectedLocation = '';
        },
        error: (error) => {
          console.error('Error submitting feedback:', error);
          this.feedbackStatus = 'Failed to submit feedback. Please try again.';
        },
      });
    } else {
      this.feedbackStatus = 'Please select a location and write feedback before submitting.';
    }

    // Clear the status message after 3 seconds
    setTimeout(() => {
      this.feedbackStatus = '';
    }, 3000);
      
    }

  

    fetchLocations() {
      this.locationService.getAllLocations().subscribe({
        next: (res) => {
          this.locations = res.data.map((item: any) => ({
            locId: item.locId, // Adjust the mapping based on the API response
            name: item.name,
            address: item.address,
            stockDetails: item.stockDetails,
          }));
          console.log(this.locations);
        },
        error: (error) => {
          console.error('Error fetching locations:', error);
        },
      });
    }

  getCategoriesWithCounts(): { [key: string]: number } {
    const categoryCounts: { [key: string]: number } = {};

    // Count items per category
    this.items.forEach((item) => {
      if (item.category) {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      }
    });

    return categoryCounts;
  }

  getOrders() {
    this.orderService.getOrders().subscribe({
      next: (response) => {
        this.orders = response.data || [];
        this.preparePieChart();
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      },
    });
  }

  prepareItemsChart() {
    const labels = Object.keys(this.barGraphData);
    const data = Object.values(this.barGraphData);
    console.log(labels, data)
    this.chart_1 = new Chart('chart_1', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Categories',
            data: data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderWidth: 1,
            barThickness: 30,
            maxBarThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 14,
                family: 'Arial, sans-serif',
              },
              color: '#333',
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: '#fff',
            bodyColor: '#000',
            borderColor: '#ccc',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#333',
              font: {
                size: 14,
                family: 'Arial, sans-serif',
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#333',
              font: {
                size: 14,
                family: 'Arial, sans-serif',
              },
            },
          },
        },
      },
    });
  }

  preparePieChart() {
    let incomingOrders = 0;
    let outgoingOrders = 0;

    this.orders.forEach((order) => {
      if (order.orderType === 'Incoming') incomingOrders += order.quantity;
      else outgoingOrders += order.quantity;
    });

    this.chart_2 = new Chart('chart_2', {
      type: 'doughnut',
      data: {
        labels: ['Incoming Orders', 'Outgoing Orders'],
        datasets: [
          {
            data: [incomingOrders, outgoingOrders],
            backgroundColor: ['#36A2EB', '#FF6384'],
            borderColor: ['#36A2EB', '#FF6384'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 14,
                family: 'Arial, sans-serif',
              },
              color: '#333',
            },
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw as number;
                const total = (tooltipItem.dataset.data as number[]).reduce(
                  (acc, curr) => acc + curr,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(2);
                return `${tooltipItem.label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }

  getReviews(): void {
    this.reviewService.getAllReviews().subscribe({
      next: (response) => {
        this.reviews = response.data;
      }
    })
  }



  fetchNotifications(): void {
    this.notificationService.getAllNotifications(this.user.userId).subscribe({
      next: (response) => {
        this.notifications = response.data || [];
        this.filterNotifications();
      },
      error: (err) => console.error('Error fetching notifications:', err),
    });
  }

  filterNotifications(): void {
    if (this.showRead) {
      this.displayedNotifications = this.notifications;
    } else {
      this.displayedNotifications = this.notifications.filter((n) => !n.read);
    }
  }

  onSelectionChange(event: any) {
    const selectedValue = event.target.value;
    // Call specific functions based on selected value
    if (selectedValue === 'orderSupplier') {
      this.provideInsightsForOrderSupplier();
    }
    // Add more conditions for other options here
  }
  provideInsightsForOrderSupplier(): void {
    const orderString = JSON.stringify(this.orders);
    const itemString = JSON.stringify(this.items);
    const prompt = `This is order data : ${orderString} and this is items data: ${itemString}, provide me analytical insights to it and do some predictions`

    this.analysisResponse = this.pleaseWaitText

    this.insightService.getInsights(prompt).subscribe({
      next: (res) => {
        this.analysisResponse = res.result.response
      }
    })
  }

}
