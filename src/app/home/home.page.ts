import { NgFor, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonLabel, IonList, IonItem, IonGrid, IonRow, IonCol, IonInput, IonSelectOption } from '@ionic/angular/standalone';

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { IonicModule } from '@ionic/angular'; // Import IonicModule
import { FormsModule } from '@angular/forms';

const client = generateClient<Schema>();


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonInput, IonGrid, IonRow, IonCol, IonItem, IonList, IonLabel, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, NgFor,
    CommonModule, FormsModule, IonSelectOption],
})
export class HomePage implements OnInit {
  constructor() { }

  signOut() {
    console.log('signOut')
  }

  areas: any[] = [];
  retos: any[] = [];

  retoName: string = '';
  retoDescription: string = '';
  selectedArea: any;

  ngOnInit(): void {
    this.listAreas();
    this.listRetos();
  }

  listAreas() {
    try {
      client.models.Area.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          console.log('areas', items);
          this.areas = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  createArea() {
    try {
      client.models.Area.create({
        areaName: window.prompt('Todo content'),
      });
      this.listAreas();
    } catch (error) {
      console.error('error creating todos', error);
    }
  }

  deleteArea(id: string) {
    client.models.Area.delete({ id })
  }



  listRetos() {
    try {
      client.models.Reto.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          console.log('retos', items);
          this.retos = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  createReto() {
    try {
      client.models.Reto.create({
        retoName: this.retoName,
        retoDescription: this.retoDescription,
        areaId: this.areas[0].id,
      });
      this.listRetos();
    } catch (error) {
      console.error('error creating todos', error);
    }
  }

  deleteReto(id: string) {
    client.models.Reto.delete({ id })
  }


  onSelectChange(event: any) {
    console.log('Selected fruit:', event.detail.value);
  }



}
